(function($) {
  Backbone.Model.prototype.idAttribute = '_id';

  var Tweet = Backbone.Model.extend({
    defaults: function() {
      return {
        author: '', 
        status: ''
      }
    }
  });

  var TweetsList = Backbone.Collection.extend({
    url: 'http://localhost:3000/tweets'
  });

  var tweets = new TweetsList(); 

  var TweetView = Backbone.View.extend({
    model: new Tweet(),
    tagName: 'div',
    events:{
      'click .edit': 'edit',
      'click .delete': 'delete',
      'blur .status': 'close',
      'keypress .status': 'onEnterUpdate'
    },
    initialize: function() {
      this.template = _.template($('#tweet-template').html());
    },
    edit:function(ev){
      ev.preventDefault();
      this.$('.status').attr('contenteditable', true).focus();
    },
    close:function(ev){
      var status = this.$('.status').text();
      this.model.set('status', status);
      this.$('.status').removeAttr('contenteditable');
      this.model.save(null, {
        success: function(response){
          console.log('Successfully UPDATED tweet with _id: ' + response.toJSON()._id);
        },
        error: function(err){
          console.log('Failed to update tweet!');
        }
      });
    },
    onEnterUpdate: function(ev){
      var self = this;
      if (ev.keyCode === 13){
        this.close();
        _.delay(function(){self.$('.status').blur()}, 100);
      }
    },
    delete:function(ev){
      this.model.destroy({
        success: function(response){
          console.log('Successfully DELETED tweet with _id: ' + response.toJSON()._id);
        },
        error: function(err){
          console.log('Failed to delete tweet!');
        }
      });
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  var TweetsView = Backbone.View.extend({
    model: tweets, 
    el: $('#tweets-container'), 
    initialize: function(){
      var self = this;
      this.model.on('add', this.render, this);
      this.model.on('remove', this.render, this)
      this.model.fetch({
      success: function(response) {
          _.each(response.toJSON(), function(item){
            console.log('Successfully GOT tweet with _id:' + item._id);
          })
        },
        error: function() {
          console.log('Failed to get tweets!');
        }
      });
    },
    render: function(){
      var self = this;
      self.$el.html('');
      _.each(this.model.toArray(), function(tweet, i ){
        self.$el.append((new TweetView({model: tweet})).render().$el);
      });   
      return this;       
    }
  });

  var appView = new TweetsView();

  $(document).ready(function() {
    $('#new-tweet').submit(function(ev) {
      var tweet = new Tweet({
        author: $('#author-name').val(), 
        status: $('#status-update').val() 
      });
      $('#author-name').val('');
      $('#status-update').val('');
      tweets.add(tweet);
      tweet.save(null, {
        success: function(response) {
          console.log('Successfully SAVED tweet with _id: ' + response.toJSON._id);  
        },
        error: function(){
          console.log('Failed to save tweet!');
        }
      });

      return false;
    });
  });


})(jQuery);