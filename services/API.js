Application.service('API', [
	'Config', '$http', 'Storage', '$q', '$rootScope',
	function (Config, $http, Storage, $q, $rootScope) {
		//endpoints wrapper
		var API = {
			authenticate: function endpointAuthentication(credentials) {
				return $http.post(
					Config.base.api + '/@authentication',
					credentials
				);
			},
			loginInfo: function endpointLoginInfo(credentials) {
				return $http.get(
					Config.base.api + '/@login_info'
				);
			},
			valid: function endpointApp() {
				return $http.get(
					Config.base.api + '/main:boards',
					{headers: API.authHeaders()}
				);
			},
			getMessages: function endpointGetMessages(id) {
				return $http.get(
					Config.base.api + '/main:lines?filter=fk_board_id%3D' + id,
					{headers: API.authHeaders()}
				);
			},
			putMessage: function endpointPostMessage(message) {
				return $http.post(
					Config.base.api + '/main:lines',
					message,
					{headers: API.authHeaders()}
				);
			},
			postLike: function endpointPostLike(like) {
				console.log(like);
				return $http.post(
					Config.base.api + '/main:likes',
					like,
					{headers: API.authHeaders()}
				);
			},
			getConversations: function endpointGetConversations() {
				return $http.get(
					Config.base.api + '/main:boards',
					{headers: API.authHeaders()}
				);
			},
			putConversation: function endpointPutConversation(conversation) {
				return $http.put(
					Config.base.api + '/main:boards',
					conversation,
					{headers: API.authHeaders()}
				);
			},
			postConversation: function endpointPostConversation(conversation) {
				return $http.put(
					Config.base.api + '/main:boards',
					conversation,
					{headers: API.authHeaders()}
				);
			},
			deleteConversation: function endpointPostConversation(conversation) {
				var auth = Storage.get('auth');
				conversation['@metadata'].action = 'DELETE';
				return $http.put(
					Config.base.api + '/main:boards',
					conversation,
					{headers: API.authHeaders()}
				);
			},
			authHeaders: function apiAuthHeaders(obj) {
				var auth = Storage.get('auth');
				var key;
				if (angular.equals(auth, null)) {
					return {};
				}
				else {
					key = auth.apikey;
				}
				return {'Authorization': 'Espresso ' + key + ':1'};
			},
			populateMetadata: function populateMetadata(entity, object) {
				object['@metadata'] = {
					action: 'INSERT',
					entity: entity,
					links: []
				};
				return object;
			},
			getLikability: function endpointGetLikability(user) {
				return $http.get(
					Config.base.api + '/likability?arg_uq_username=' + user,
					{headers: API.authHeaders()}
				);
			},
			postUser: function endpointPostUser(user) {
				var deferred = $q.defer();
				API.authenticate({unregistered:true})
					.success(function (data) {
						var $promise = $http.post(
							Config.base.api + '/main:users',
							user,
							{headers: {Authorization:'Espresso ' + data.apikey +':1'}}
						).success(function () {
							$rootScope.$broadcast('AuthAuthenticate', {
								uq_username: user.uq_username,
								password: user.password
							});
						});
						deferred.resolve($promise);
					})
					['error'](function () {
						deferred.reject('No user created');
					});
				return deferred.promise;
			},
		};
		return API;
	}
]);