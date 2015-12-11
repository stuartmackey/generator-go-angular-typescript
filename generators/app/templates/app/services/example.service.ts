module app {
	'use strict';

    export class ExampleService {
        constructor( private $http: ng.IHttpService, private $q: ng.IQService ) { }

        public addSomething(something:any):ng.IPromise<any> {
           var d = this.$q.defer();

           this.$http.post<any>(API.END_POINT + '/example', something)
            .success(response => d.resolve(response))
            .error(err => d.reject(err));

            return d.promise;
        }
	}
	angular
    .module('app')
    .service('ExampleService', ExampleService);
}