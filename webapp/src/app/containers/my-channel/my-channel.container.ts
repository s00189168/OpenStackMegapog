import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

const baseUrl = environment.API_BASE;

@Component({
    selector: 'pog-my-channel',
    templateUrl: './my-channel.container.html',
    styleUrls: ['./my-channel.container.css']
})
export class MyChannelContainer {
  name;
  isActive;
  constructor(
    private authService:AuthService
  ) {
    this.name = authService.authValue.name;
    this.fetchIsActive();
  }

  fetchIsActive() {
    let that = this;
    const url = baseUrl + "/channels/mine";
    fetch(url,
    {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + this.authService.authValue.token,
        }
    }).then(function(res){ return res.json(); })
      .then(function(data){ 
        that.isActive = data?.active ?? false;
      });
  }

  join() {
    const url = baseUrl + "/channels/mine/join";
    fetch(url,
    {
        method: "POST",
        body: JSON.stringify("{}"),
        headers: {
            'Authorization': 'Bearer ' + this.authService.authValue.token,
        }
    });
    window.location.replace("/my-channel");
  }

  part() {
    const url = baseUrl + "/channels/mine/part";
    fetch(url,
    {
        method: "POST",
        body: JSON.stringify("{}"),
        headers: {
            'Authorization': 'Bearer ' + this.authService.authValue.token,
        }
    });
    window.location.replace("/my-channel");
  }
}
