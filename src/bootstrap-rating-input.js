(function ($) {   
    
    //Defaults for rounding
  var defaults = {
      round : {down: .25, up: .75}
  };
   
  $.fn.redraw = function(value){
      
      // A private function to highlight a star corresponding to a given value
      function _paintValue(ratingInput, value) {
          var decimalValue = (value-Math.floor(value)).toFixed(2);
          var whichStar = Math.ceil(value);
          if(decimalValue!=0){
              whichStar = whichStar-1;
          }
          var selectedStar = $(ratingInput).find('[data-value='+whichStar+']');
          selectedStar.removeClass('fa-star-o').addClass('fa-star');
          selectedStar.prevAll('[data-value]').removeClass('fa-star-o').addClass('fa-star');
          selectedStar.nextAll('[data-value]').removeClass('fa-star').addClass('fa-star-o');
          var nextStar = selectedStar.next('[data-value]');
          var icon = 'fa-star-o';
          if(decimalValue>defaults.round.down){
              icon = 'fa-star-half-o';
              if(decimalValue>defaults.round.up){
                  icon='fa-star';
              }
          }
          nextStar.removeClass('fa-star-o').addClass(icon);
      } 
      
      var self = this;
      _paintValue(self.closest('.rating-input'), value);
  };
    
  $.fn.rating = function () {
    var element;   

    // A private function to remove the highlight for a selected rating
    function _clearValue(ratingInput) {
      var self = $(ratingInput);
      self.find('[data-value]').removeClass('fa-star').addClass('fa-star-o');
    }

    // A private function to change the actual value to the hidden field
    function _updateValue(input, val) {
      input.val(val).trigger('change');
      if (val === input.data('empty-value')) {
        input.siblings('.rating-clear').hide();
      }
      else {
        input.siblings('.rating-clear').show();
      }
    }

    // Iterate and transform all selected inputs
    for (element = this.length - 1; element >= 0; element--) {
      var el, i,
        originalInput = $(this[element]),
        max = originalInput.data('max') || 5,
        min = originalInput.data('min') || 0,
        clearable = originalInput.data('clearable') || null,
        readonly = originalInput.data('readonly') || null,
        stars = '';
      // HTML element construction
      for (i = min; i <=max; i++) {
        // Create <max> empty stars
        stars += ['<span class="fa fa-star-o"       data-value="', i, '"></span>'].join('');
      }
      // Add a clear link if clearable option is set
      if (clearable && !readonly) {
        stars += [
          ' <a class="rating-clear" style="display:none;" href="javascript:void">',
          '<span class="glyphicon glyphicon-remove"></span> ',
          clearable,
          '</a>'].join('');
      }

      // Clone with data and events the original input to preserve any additional data and event bindings.
      var newInput = originalInput.clone(true)
        .attr('type', 'hidden')
        .data('max', max)
        .data('min', min);

      // Rating widget is wrapped inside a div
      el = [
        '<div class="rating-input">',
        stars,
        '</div>'].join('');

      // Replace original inputs HTML with the new one
      originalInput.replaceWith($(el).append(newInput));
    }

    // Give live to the newly generated widgets
    $('.rating-input')
      // Highlight stars on hovering
      .on('mouseenter', '[data-value]', function () {
          var rating_system = $(this).closest('.rating-input').find(".rating");
          var rating_readOnly = rating_system.data('readonly');
          if(!rating_readOnly){
              var self = $(this);
              self.redraw(self.data('value'));
          }
      })
      // View current value while mouse is out
      .on('mouseleave', '[data-value]', function () {
        var self = $(this),
          input = self.siblings('input'),
          val = input.val(),
          min = input.data('min'),
          max = input.data('max');
        if (val >= min && val <= max) {
            self.redraw(val);
        } else {
          _clearValue(self.closest('.rating-input'));
        }
      })
      // Set the selected value to the hidden field
      .on('click', '[data-value]', function (e) {
          var rating_system = $(this).closest('.rating-input').find(".rating");
          var rating_readOnly = rating_system.data('readonly');
          if(!rating_readOnly){
              var self = $(this),
              val = self.data('value'),
              input = self.siblings('input');
              _updateValue(input,val);
              e.preventDefault();
              $.ajax({
                  
              });
              return false;
         }
      })
      // Remove value on clear
      .on('click', '.rating-clear', function (e) {
        var self = $(this),
          input = self.siblings('input');
        _updateValue(input, input.data('empty-value'));
        _clearValue(self.closest('.rating-input'));
        e.preventDefault();
        return false;
      })
      // Initialize view with default value
      .each(function () {
        var input = $(this).find('input'),
          val = input.val(),
          min = input.data('min'),
          max = input.data('max');
        if (val !== "" && +val >= min && +val <= max) {
          $(this).redraw(val);
          $(this).find('.rating-clear').show();
        }
        else {
          input.val(input.data('empty-value'));
          _clearValue(this);
        }
      });

  };

  // Auto apply conversion of number fields with class 'rating' into rating-fields
  $(function () {
    if ($('input.rating[type=number]').length > 0) {
      $('input.rating[type=number]').rating();
    }
  });

}(jQuery));
