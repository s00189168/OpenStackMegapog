import { Component } from '@angular/core';

@Component({
  selector: 'pog-not-found',
  template: `
  <div class="row align-items-center">
  <div class="col align-self-center" style="text-align: center;">
  <h1>404 NOT FOUND</h1>
  <img class="img-responsive" src="assets/images/pognotfound.png" alt="404 Not Found">
  </div>
</div>
  `,
  styleUrls: ['./not-found.container.css']
})
export class NotFoundContainer {

}
