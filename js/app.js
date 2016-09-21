var React    = require('react');
var ReactDOM = require('react-dom');
var BookView = require('./book.js');


var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        {this.props.children}
      </div>
    );
  }
});

ReactDOM.render((
  <App>
    <BookView />
  </App>
), document.getElementById("root"));
