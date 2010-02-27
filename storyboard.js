;(function () {
      Storyboard = function(elts, callback) {
          this.elts = elts;
          this.callback = callback;
          this.resize();
          this.refindpos();
          var closedthis = this;
          $(window).resize(function() {closedthis.resize(); closedthis.doscroll();});
          $(window).scroll(function() {closedthis.refindpos();});
      };

      Storyboard.prototype.cur = function() {
          return this.current + 1;  // 0-based to 1-based
      };

      Storyboard.prototype.total = function() {
          return this.positions.length;
      };

      Storyboard.prototype.refindpos = function() {
          var pos = $(window).attr('scrollX'),
              obj = this,
              last;
          $.each(this.positions, function(i) {
                     if (this && Math.abs(pos - this) >
                         Math.abs(pos - obj.positions[last])) {
                         obj.current = last;
                         return false;
                     } else if (i === obj.positions.length - 1) {
                         obj.current = i;
                         return false;
                     } else {
                         last = i;
                         return true;
                     }
                 });
          this.callback(this.cur(), this.total());
      };

      Storyboard.prototype.doscroll = function() {
          $(window).unbind('scroll');
          var closedthis = this;
          $.scrollTo(this.positions[this.current], 'fast',
                     {'onAfter': function() {
                          $(window).scroll(function() {closedthis.refindpos();});
                      }});
          this.callback(this.cur(), this.total());
      };

      Storyboard.prototype.goto = function(i) {
          this.current = Math.max(Math.min(i, this.positions.length - 1), 0);
          this.doscroll();
      };

      Storyboard.prototype.prev = function() {
          this.current = Math.max(this.current - 1, 0);
          this.doscroll();
      };

      Storyboard.prototype.next = function() {
          this.current = Math.min(this.current + 1, this.positions.length - 1);
          this.doscroll();
      };

      Storyboard.prototype.resize = function() {
          this.positions = $.makeArray();
          var wh = $(window).height(),
              ww = $(window).width(),
              accumulated = 0,
              obj = this;
          this.elts.each(function(i) {
                             obj.positions.push(accumulated);
                             var eh = $(this).height(),
                                 ew = $(this).width();
                             $(this).css({'position': 'absolute',
                                          'top': (wh - eh) / 2,
                                          'left': accumulated + (ww - ew) / 2});
                             accumulated += (ww + ew) / 2 + 10;
                             if (i === obj.elts.length - 1) {
                                 $(this).css('padding-right', (ww - ew) / 2);
                             }
                         });
      };
  })();
