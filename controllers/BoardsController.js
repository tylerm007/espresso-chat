'use strict';
Application.controller('BoardsController', [
	'$rootScope', 'Storage', 'API', '$scope', '$location',
	function ($rootScope, Storage, API, $scope, $location) {
		$scope.board = {};
		$rootScope.board = {};
		$scope.boardsList = []; //retrieve from server later
		$scope.activeConversation = false;
		
		//conversation/user interfaces
		$scope.boards = {
			add: function () {
				var auth = Storage.get('auth');
				var conversation = {
					id: '',
					fk_creator: auth.uq_username,
					open: true,
					deletable: true,
					comments: 0,
					time: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS')+'Z'
				};
				
				API.populateMetadata('boards', $scope.board);
				angular.extend($scope.board, conversation); 
				API.putConversation($scope.board).success($scope.boards.reset);
			},
			refresh: function () {
				API.getConversations().success(function (data) {
					$scope.boardsList = data;
				});
			},
			reset: function () {
				$scope.boards.refresh();
				$scope.boards.title = '';
			},
			activate: function (conversation) {
				$location.path('/board/' + conversation.id);
				$rootScope.board = conversation;
				$scope.refreshDialogue = function () {
					API.getMessages(conversation.id).success(function (data) {
						$scope.dialogueList = data;
						$scope.activeConversation = conversation;
					});
				}
				setInterval(function () {
					$scope.$apply($scope.refreshDialogue);
				}, 3000);
				$scope.refreshDialogue();
			},
			toggleStatus: function (conversation) {
				conversation.open = !conversation.open;
				API.postConversation(conversation)
					.success($scope.boards.reset)
					['error'](function () {
						conversation.open = !conversation.open;
					});
				console.log('toggle status', conversation);
			},
			confirmDelete: function (conversation) {
				var execute = confirm('Are you sure you want to delete ' + conversation.title);
				if (execute) {
					API.deleteConversation(conversation).success($scope.boards.reset);
				}
			}
		};
		
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
		
		//populate conversations
		$scope.boards.refresh();
	}
]);