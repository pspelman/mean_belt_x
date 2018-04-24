import {Component, Injectable, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataManagerService, RestaurantModel} from "../data-manager.service";




@Injectable()
class Review {
  user_name: string;
  review_text: string;
  stars: number;

  constructor(user_name = "", review_text = "", stars = null) {
    this.user_name = user_name;
    this.review_text = review_text;
    this.stars = stars;
  }

}



@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})

export class ReviewsComponent implements OnInit {
  // new_review: any;
  restaurant_id: any;

  new_review = new Review();
  currentRate = 1;

  star_select = [1, 2, 3, 4, 5];

  selected_restaurant = new RestaurantModel();
  backend_errors: any;
  // stars_select = [
  //   {'value':1},
  //   {'value':2},
  //   {'value':3},
  //   {'value':4},
  //   {'value':5},
  //   ];

  constructor(private _http: DataManagerService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.restaurant_id = params['restaurant_id'];
      console.log(`got the id: `, this.restaurant_id);
    });

  }

  ngOnInit() {
    //get the requested restaurant

    let observable = this._http.getRestaurantById(this.restaurant_id);
    observable.subscribe(data => {
      console.log(`Query for specific restaurant returned: `, data);
      // this.restaurant_data = data['restaurant'][0];
      this.selected_restaurant = data['restaurant'][0];
      console.log(`selected restau:`,this.selected_restaurant);
      this.restaurant_id = data['restaurant'][0]._id;
      // this.selected_restaurant.id = data['restaurant'][0].id;
      // this.selected_restaurant.restaurant_name = data['restaurant'][0].restaurant_name;
      // this.selected_restaurant.cuisine_type = data['restaurant'][0].cuisine_type;
      // this.selected_restaurant.description = data['restaurant'][0].description;
    })


  }



  validateForm() {
    console.log(`checking form for valid inputs`,);
    if (this.new_review.user_name.length < 3 ||
      this.new_review.review_text.length < 3 {
      console.log(`invalid form data`,);
      return true;
    } else {
      console.log(`enough data to send`,);
      return false;
    }
  }

  navHome() {
    this.router.navigateByUrl('/home');
  }


  logChange(change_item: HTMLInputElement) {
    console.log(`Item changed: `,change_item);
    console.log(`ViewModel: `,change_item['viewModel']);
  }

  //todo: make request to DB to update restaurant
  createNewReview() {
    this.backend_errors = null;
    let router = this.router;
    if (!this.validateForm()) {
      console.log(`trying to update restaurant`,);
      let observable = this._http.createRestaurantReview(this.restaurant_id, this.new_review);
      observable.subscribe(response => {
        console.log(`response from server for UPDATE review: `, response);
        if (!response['errs'].has_errors) {
          router.navigateByUrl('/home');
        } else if (response['errs'].has_errors) {
          this.backend_errors = response['errs'].error_list;
          console.log(``,this.backend_errors);
        }
      });
      //this means it's valid
    } else {
      //this means something was wrong with the form
      alert('you must complete the form before you can submit it')
    }
  }
  //
  // createNewReview(id) {
  //   console.log(`trying to submit review for restau: ${id}`,);
  //   let review_request = this._http.createRestaurantReview(id, this.new_review);
  //   review_request.subscribe(response => {
  //
  //   });
  //
  // }

  validateReview() {

  }

}
