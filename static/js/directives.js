var directives = angular.module('huaweiApp.directives', []);



directives.directive('myCustomer', function() {
  return {
    templateUrl: 'index.html'
  };
});


/*directives.directive('accordion', function () {
	return {
		restrict: 'EA',
		replace: true,
		transclude: true,
		priority: 1,
		template: '<div class="accordion"><div id="transcluded" ng-transclude></div></div>',
		controller: function () {
			var expanders = [];
			this.opened = function (expander) {
				for (var i = 0; i < expanders.length; i++) {
					if (expander != expanders[i]) {
						expanders[i].expanded = false;
					}
				}
			};
			this.addExpander = function (exp) {
				expanders.push(exp);
			};
		},
		link: function (scope, elem) {
			elem.append(elem.find('#transcluded').children());
			elem.find('#transcluded').remove();

			elem.removeAttr('accordion');
			elem.removeAttr('accordion-title');
		}
	};
});

directives.directive('expander', function () {
	return {
		restrict: 'EA',
		replace: true,
		scope: true,
		transclude: 'element',
		priority: 1,
		require: '^?accordion',
		template: '<div class="expander"><div class="expander-title" ng-click="toggle()">{{title}}</div><div class="expander-body" ng-transclude style="display:none;"></div></div>',
		link: function (scope, elem, attrs, accordionController) {
			scope.expanded = false;
			var title = attrs.expanderTitle,
				titleOpen = attrs.titleOpen || title,
				titleClosed = attrs.titleClosed || title;
			scope.title = title || titleClosed;

			// the reason for this is because we're using transclude: 'element'
			// otherwise we'd end up with an extra expander attr lying around,
			// not good.
			elem.children('.expander-body').children().eq(0).removeClass();
			elem.children('.expander-body').children().eq(0).removeAttrs();

			var bdy = elem.children('.expander-body');
			scope.$watch('expanded', function () {
				scope.title = scope.expanded ? titleOpen : titleClosed;
				if (scope.expanded) {
					bdy.slideDown(300);
				} else {
					bdy.slideUp(300);
				}
			});

			if (accordionController) {
				accordionController.addExpander(scope);
			}
			scope.toggle = function () {
				scope.expanded = !scope.expanded;
				if (accordionController) {
					accordionController.opened(scope);
				}
			};
			elem.removeAttr('expander');
		}
	};
});

directives.directive('mouseExpander', function () {
	return {
		restrict: 'EA',
		replace: true,
		scope: true,
		transclude: true,
		template: '<div class="expander" ng-mouseenter="toggle()" ng-mouseleave="toggle()"><div class="expander-title">{{title}}</div><div class="expander-body" ng-transclude style="display:none;"></div></div>',
		link: function (scope, elem, attrs) {
			var title = attrs.expanderTitle,
				titleOpen = attrs.titleOpen || title,
				titleClosed = attrs.titleClosed || title,
				bdy = elem.children('.expander-body');
			scope.expanded = false;
			scope.title = title || titleClosed;

			scope.toggle = function () {
				scope.expanded = !scope.expanded;
				scope.title = scope.expanded ? titleOpen : titleClosed;
				if (scope.expanded) {
					bdy.slideDown(300);
				} else {
					bdy.stop().slideUp(300);
				}
			};
		}
	};
});

// WARNING: point, etc may conflict with the names of parent
// scope functions or variables. but if you set scope to true,
// any ng-modeling done inside the sidebar will be removed.
directives.directive('sidebar', function ($location, $timeout) {
	return {
		restrict: 'EA',
		replace: true,
		transclude: true,
		// make sure to have the z-index = 1 on the indicator
		// if you actually want it to show above the transclusion
		template: [
				'<div class="sidebar">',
					'<div class="indicator"></div>',
					'<div class="elements" ng-transclude></div>',
				'</div>'
				].join(''),
		controller: function ($scope, $element, $attrs) {
			$(window).scroll(function (event) {
				// this doesn't work if you're zoomed in
				if ($(window).scrollLeft() <= 0) {
					$element.css("margin-left", 0);
				} else if (parseInt($attrs.containerWidth, 10) - $(window).scrollLeft() <= $(window).width()) {
					$element.css("margin-left", 0 - $element.css('width'));
				} else {
					$element.css("margin-left", 0 - $(document).scrollLeft());
				}
			});

			var elements = [],
				selected_scope;

			var pointTo = function (elt) {
				var new_top = (elt.position().top + ($(elt).outerHeight(true) / 2) -
					($element.find('.indicator').outerHeight(true) / 2)) + 'px';
				$element.find('.indicator').css('top', new_top);
			};

			var selectElement = function (scp, elt) {
				selected_scope = scp;
				pointTo(elt);
				for (var i = 0; i < elements.length; i++) {
					if (scp != elements[i].scp) {
						elements[i].scp.selected = false;
					}
				}
				scp.selected = true;
			};

			this.selectElement = selectElement;

			var selectOnRoute = function () {
				for (var i = 0; i < elements.length; i++) {
					if (elements[i].scp.route && RegExp(elements[i].scp.route).exec($location.path())) {
						selectElement(elements[i].scp, elements[i].elt);
						break;
					}
				}
			};

			$scope.$on('$routeChangeSuccess', function () {
				$timeout(function () {
					selectOnRoute();
				}, 150);
			});

			this.addElement = function (scp, elt) {
				elements.push({scp: scp, elt: elt});
				if (elements.length === 0) {
					pointTo(elt);
					scp.selected = true;
					selected_scope = scp;
				}
			};
		}
	};
});

directives.directive('sidebarElement', function () {
	return {
		restrict: 'EA',
		replace: true,
		transclude: true,
		scope: {clicked: '&', route: '@'},
		require: '^?sidebar',
		template: '<div class="element-container" ng-click="select();clicked();"><div class="element" ng-class="{\'selected\': selected}" ng-transclude></div></div>',
		link: function (scope, element, attrs, sidebarController) {
			scope.route = scope.route  || 'a^';  // matches nothing
			scope.selected = false;
			if (!attrs.hasOwnProperty('disabled')) {
				sidebarController.addElement(scope, element);
			} else {
				element.find('.element').addClass('disabled');
				return;
			}

			scope.$watch('selected', function () {
				if (scope.selected) {
					element.find('.element').addClass('selected');
				}
			});

			scope.select = function () {
				if (!scope.selected) {
					scope.selected = true;
					sidebarController.selectElement(scope, element);
				}
			};
		}
	};
});

var basic = [
	'curriculum',
	'intro',
	'units',
	'unit',
	'lessons',
	'lesson',
	'overview',
	'assignments',
	'content',
	'project',
	'note',
	'name',
	'time',
	'number',
	'task',
	'description'
];

var maybe_list = [
	'technologies',
	'comprehensionChecks',
	'prerequisites',
	'concepts',
	'goals',
	'skills',
	'steps',
	'setup',
	'selfAssessment',
	'requirements'
];

var maybe_listed = [
	'technology',
	'comprehensionCheck',
	'prerequisite',
	'concept',
	'goal',
	'skill',
	'step',
	'question',
	'requirement'
];

var all_dirs = [].concat(basic, maybe_list, maybe_listed);

// if you read this before understanding directives or reading the xml
// compilation docs located in this app, you're going to have a bad time
angular.forEach(all_dirs, function (dir) {
	directives.directive(dir, function ($compile) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			priority: 2,
			// the calemToHyphen business is to make sure that myDirective
			// (a JS expression) goes to my-directive (an HTML expression)
			template: '<div class="' + camelToHyphen(dir) + '"><div id="transcluded" ng-transclude></div></div>',
			link: function (scope, elem, attrs) {
				// taking care of the transclusion, i hate this
				// it turns out that if you're trying to transclude two
				// top-level elements, as in <div><div /></div /></div>,
				// Angular will just not do it and not tell you. so we
				// need to transclude to a temporary element, then move
				// those elements around
				elem.append(elem.find('#transcluded').children());
				elem.find('#transcluded').remove();

				// simple and meta are very much related
				if (!attrs.hasOwnProperty('simple')) {
					var meta,
						meta_container,
						container;

					// we only want a container if the element is not simple
					container = $('<div class="' + camelToHyphen(dir) + '-container"></div>');

					// meta also has no meaning if there is no container, hence
					// we don't do it if the element is simple
					meta = elem.children('[meta]').
						add(elem.find('> [class*="-container"] > [meta]').parent());
					if (meta.length > 0) {
						meta_container = $('<div class="meta-container"></div>');
						meta_container.append(meta);
					}

					elem.wrap('<div class="' + camelToHyphen(dir) + '-container"></div>');
					elem.parent().prepend(meta_container);
				}

				// lists
				if (attrs.list === 'ordered') {
					elem.changeTag('<ol />');
				} else if (attrs.list === 'unordered') {
					elem.changeTag('<ul />');
				} else if (attrs.hasOwnProperty('listed')) {
					elem.changeTag('<li />');
				}
			}
		};
	});
});
*/
// some things to keep in mind when implementing tracking:
// for the first page, the lessons are inside expadners, which create their
// own scope. this means that the indicator can't get the right information.
// hence, the expander directive should NOT create its own scope with {}
// (this is due to a feature of scopes on directives, where they do not
// inherit if done with {}). use scope: true instead. The directive should end
// up looking something like this, but with better ways to access the
// indicator for the same number lesson in a different number unit.
// make sure to add indicator='indicator' or something similar to the schema.

// directives.directive('lesson', function () {
// 	return {
// 		restrict: 'E',
// 		replace: true,
// 		transclude: true,
// 		priority: 2,
// 		template:
// 		'<div class="lesson-container">' +
// 			'<div class="meta-container">' +
// 				'<div ng-class=\'{completed: "scope.complete[unit_num][lesson_num]"}\' ng-click="checkOff()"></div>' +
// 			'</div>' +
// 			'<div class="lesson">' +
// 				'<div id="transcluded" ng-transclude></div>' +
// 			'</div>' +
// 		'</div>',
// 		link: function (scope, elem, attrs) {
// 			var transcluded = elem.find('#transcluded');
// 			elem.append(transcluded.children());
// 			transcluded.remove();

// 			elem.find('.lesson').copyAttrsFrom(elem);
// 			elem.removeAttrs();

// 			var metadata_container = elem.find('.meta-container'),
// 				metadata = elem.children('[meta]').
// 					add(elem.find('> [class*="-container"] > [meta]').parent());
// 			metadata_container.append(metadata);

// 			scope.lesson_num = parseInt(attrs.number, 10);
// 			scope.unit_num = parseInt(elem.parents('unit').attr('number'), 10);

// 			scope.checkOff = function () {
// 				scope.complete[unit_num][lesson_num] = true;
// 			};
// 		}
// 	};
// });
