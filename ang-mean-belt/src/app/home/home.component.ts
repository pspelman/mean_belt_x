import { Component, OnInit } from '@angular/core';
import {DataManagerService} from "../data-manager.service";
import {Router, ActivatedRoute} from "@angular/router";



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _http: DataManagerService, private router: Router) { }

  public list_of_all_the_things: any;



  ngOnInit() {

    //TODO: get all the things
    let observable = this._http.getAllThings();
    observable.subscribe(data => {
      console.log(`recieved ALL THINGS DATA: `, data);
      this.list_of_all_the_things = data['belt_test_models'];

    });


  }



}
