var React          = require('react');
var CssTransGrp    = require('react-addons-css-transition-group');
var LimitOrderBook = require('limit-order-book').LimitOrderBook;
var LimitOrder     = require('limit-order-book').LimitOrder;
var MarketOrder    = require('limit-order-book').MarketOrder;


var OrderInputView = React.createClass({
  isPositiveInt: function(str) {
    var n = ~~Number(str);
    return String(n) === str && n >= 0;
  },
  handleChange: function(event) {
    this.setState({ value : event.target.value });
  },
  handleSubmit: function(event) {
    if (event.keyCode !== undefined && event.keyCode !== 13) {
      return;
    }

    var parts = this.state.value.split(" ");
    var error = undefined;

    if (parts.length !== 4) {
      error = "expected 4 parts";
    } else if (parts[0].toUpperCase() !== "L" && parts[0].toUpperCase() !== "M") {
      error = "type = 'L' || 'M'";
    } else if (parts[1].toLowerCase() !== "ask" && parts[1].toLowerCase() !== "bid") {
      error = "side = 'ask' || 'bid'";
    } else if (isNaN(parts[2]) || !this.isPositiveInt(parts[2]) || isNaN(parts[3]) || !this.isPositiveInt(parts[3])) {
      error = "#'s = positive int";
    } else if (parts[0].toUpperCase() === "L") {
      this.props.callback(new LimitOrder(
          this.state.orderId.toString(), parts[1].toLowerCase(), parseInt(parts[2]), parseInt(parts[3])
      ));
    } else {
      this.props.callback(new MarketOrder(
          this.state.orderId.toString(), parts[1].toLowerCase(), parseInt(parts[2]), parseInt(parts[3])
      ));
    }

    if (error !== undefined) {
      this.setState({ value : error });
    } else {
      this.setState({ orderId : (this.state.orderId + 1) });
    }
  },
   getInitialState: function() {
    return {
      orderId : 0,
      value   : "L bid 100 5"
    };
  },
 render: function() {
    return (
      <div className="row">
        <div className="orderInputView">
          <input className="input-lg col-xs-8" type="text" value={this.state.value}
                 onChange={this.handleChange} onKeyDown={this.handleSubmit} />
          <div className="input-lg btn btn-primary col-xs-4" onClick={this.handleSubmit}>SUBMIT</div>
        </div>
      </div>
    );
  }
});

var HeaderView = React.createClass({
  render: function() {
    return (
      <div className="row">
        <div className="headerView">
          <p className="col-xs-6">volume</p>
          <p className="col-xs-6">price</p>
        </div>
      </div>
    );
  }
});

var BookLimitView = React.createClass({
  render: function() {
    return (
      <div className="row">
        <div className="bookLimitView">
          <div className="col-xs-6">
            <p className="limitVolume" style={{ width: Math.round(this.props.relVolume) + "%" }}>
              {this.props.limit.volume}
            </p>
          </div>
          <p className="col-xs-6 limitPrice">{this.props.limit.price}</p>
        </div>
      </div>
    );
  }
});

var BookSideView = React.createClass({
  getVolume: function() {
    return this.props.limits.reduce(function(total, limit) { return total + limit.volume; }, 0);
  },
  render: function() {
    var volume = this.getVolume();
    var items  = this.props.limits.map(function(limit) {
      return <BookLimitView key={limit.price} limit={limit} relVolume={(limit.volume / volume) * 100} />;
    }.bind(this));

    if (this.props.side === "bid") { items = items.reverse(); }

    return (
      <div className="row">
        <div className="bookSideView">
          <CssTransGrp
            className={this.props.side + "Side col-xs-12"}
            transitionName="bookLimits"
            transitionEnterTimeout={800}
            transitionLeaveTimeout={500}>
            {items}
          </CssTransGrp>
        </div>
      </div>
    );
  }
});

var SpreadView = React.createClass({
  render: function() {
    return (
      <div className="row">
        <div className="spreadView">
          <p className="col-xs-12">spread {this.props.spread}</p>
        </div>
      </div>
    );
  }
});

var BookView = React.createClass({
  getSpread: function() {
    if (this.state.book.askLimits.peek() !== undefined && this.state.book.bidLimits.peek() !== undefined) {
      return this.state.book.askLimits.peek().price - this.state.book.bidLimits.peek().price;
    } else {
      return 0;
    }
  },
  handleOrder: function(order) {
    this.setState({ taker : order });
  },
  getInitialState: function() {
    return {
      book  : new LimitOrderBook(),
      taker : undefined,
      take  : undefined
    };
  },
  componentWillUpdate: function(nextProps, nextState) {
    if (nextState.taker !== undefined) {
      nextState.take  = nextState.book.add(nextState.taker);
      nextState.taker = undefined;
    }
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (prevState.take !== undefined) { this.setState({ take : undefined }); }
  },
  render: function() {
    return (
      <div className="bookView">
        <HeaderView />
        <div className="row">
          <div className="pre-scrollable col-xs-12">
            <BookSideView side="ask" limits={this.state.book.askLimits.queue} />
            <SpreadView spread={this.getSpread()} />
            <BookSideView side="bid" limits={this.state.book.bidLimits.queue} />
          </div>
        </div>
        <OrderInputView callback={this.handleOrder} />
      </div>
    );
  }
});


module.exports = BookView;
