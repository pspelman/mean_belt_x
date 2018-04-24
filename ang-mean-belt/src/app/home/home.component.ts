import { Component, OnInit } from '@angular/core';
import {DataManagerService} from "../data-manager.service";
import {Router, ActivatedRoute} from "@angular/router";



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private backend_errors: any;

  constructor(private _http: DataManagerService, private router: Router) { }

  public list_of_all_the_things: any;



  ngOnInit() {

    //TODO: get all the things
    let observable = this._http.getAllRestaurants();
    observable.subscribe(data => {
      console.log(`recieved ALL THINGS DATA: `, data);
      this.list_of_all_the_things = data['restaurants'];

    });


  }


  deleteRestaurant(id: any) {
    console.log(`clicked delete...`,);
    let deletion = this._http.deleteRestaurant(id);
    deletion.subscribe(response => {
      console.log(`server responded to delete request: `, response);
      if (!response['errs'].has_errors) {
        console.log(`no errors!`,);
        this.router.navigateByUrl('/home');

      } else if (response['errs'].has_errors) {
        this.backend_errors = response['errs'].error_list;
        console.log(`got errors: `,this.backend_errors);
      }
    });

  }
}
