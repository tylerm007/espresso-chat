'use strict';
Application.controller('LinesController', [
	'$rootScope', 'Storage', 'API', '$scope', '$routeParams',
	function ($rootScope, Storage, API, $scope, $routeParams) {
		$scope.line = {};
		$scope.activeLines = false;
		var interval = setInterval(function () {}, 3000); //init interval
		
		$scope.users = {
			getInfo: function ($event, conversation) {
				var $element = angular.element($event.target);
				API.getLikability(conversation.fk_creator).success(function (data) {
					$element.data('powertip', data[0].comment_count + ' <i class="fa fa-comment-o"></i> ' + data[0].likes_count + ' <i class="fa  fa-thumbs-up"></i>');
					$element.powerTip({
						placement: 's',
						smartPlacement: true
					});
					$element.powerTip('show');
				});
			}
		};
		
		//chat interfaces
		$scope.lines = {
			add: function (parent_id) {
				if (!parent_id) {
					parent_id = 0;
				}
				var auth = Storage.get('auth');
				var message = {
					fk_parent_id: parent_id,
					fk_board_id: $rootScope.board.id,
					time: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS')+'Z',
					fk_creator: auth.uq_username,
					likes: 0
				};
				
				API.populateMetadata('lines', $scope.line);
				angular.extend($scope.line, message); 
				API.putMessage($scope.line)
					.success(function (data) {
						$scope.lines.getLines();
						$scope.line.message = '';
					})
					['error']($scope.lines.fail);
			},
			fail: function (data) {
				console.log('chat failed', data);
				if (data.errorCode === 50052) {
					alert(data.errorMessage);
				}
				else {
					//server error, possibly no message entered
				}
			},
			like: function (dialogue) {
				var auth = Storage.get('auth');
				var like = {
					fk_line_id: dialogue.id,
					fk_username: auth.uq_username,
					fk_liked_user: dialogue.fk_creator
				};
				API.postLike(like)
					.success(function (data) {
						$scope.lines.getLines();
					})
			},
			getLines: function () {
				clearInterval(interval);
				$scope.refreshDialogue = function () {
					console.log($routeParams);
					API.getMessages($routeParams.id).success(function (data) {
						$scope.dialogueList = data;
						$scope.activeLines = $rootScope.board;
					});
				};
				interval = setInterval(function () {
					$scope.$apply($scope.refreshDialogue);
				}, 3000);
				$scope.refreshDialogue();
			}
		};
		
		$scope.lines.getLines();
	}
]);