import { Component, OnInit } from '@angular/core';
import {DataManagerService} from "../data-manager.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RestaurantModel} from "../data-manager.service";


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  restaurant_id: any;


  constructor(private _http: DataManagerService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.restaurant_id = params['restaurant_id'];
      console.log(`got the id: `, this.restaurant_id);
    });
  }

  selected_restaurant = new RestaurantModel();
  backend_errors: any;

  sample_review: any;
  reviews: any;

  ngOnInit() {
    //todo: get the selected restaruant
    let observable = this._http.getRestaurantById(this.restaurant_id);
    observable.subscribe(data => {
      console.log(`Query for specific restaurant returned: `,data);


      //FIXME: extract the selected restaurant from the result
      this.selected_restaurant = data['restaurant'][0];
      this.reviews = this.selected_restaurant.reviews;
      console.log(`Reviews: `,this.reviews);
    });

    this.sample_review = {
      "user_name": "phil",
      "stars": 4,
      "review_text": "This was a good place",
    };



  }


  //TODO: Try to sort by the number of stars given (descending order)



}
