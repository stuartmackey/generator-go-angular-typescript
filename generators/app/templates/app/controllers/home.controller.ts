module app {
	'use strict';

	export class HomeCtrl {
		public static $inject = [];

		constructor() {
			console.log( 'This is in the constructor of the home controller');
		}
	}
	angular
		.module('app')
		.controller('HomeCtrl', HomeCtrl);
}