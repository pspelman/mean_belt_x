import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {DataManagerService} from "../data-manager.service";
import {RestaurantModel} from "../data-manager.service";


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  backend_errors: any;
  name: any;
  attribute_one: any;
  attribute_two: any;
  attribute_three: any;
  details: any;
  skills: Array<any>;
  skill_one: string="";
  skill_two: string="";
  skill_three: string="";

  constructor(private _http: DataManagerService, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  //make the model for a new thing
  // new_thing = {
  //   'name': this.name,
  //   'description': this.details,
  //   'attribute_one': this.attribute_one,
  //   'attribute_two': this.attribute_two,
  //   'attribute_three': this.attribute_three
  // };

  new_thing: any;
  new_restaurant = new RestaurantModel();

  ngOnInit() {

  }

  logChange(change_item: HTMLInputElement) {
    console.log(`Item changed: `,change_item);
    console.log(`ViewModel: `,change_item['viewModel']);
  }


  validateForm() {
    console.log(`checking form for valid inputs`,);
    if (this.new_restaurant.restaurant_name.length < 3 ||
      this.new_restaurant.description.length < 3 ||
      this.new_restaurant.cuisine_type.length < 3) {
      console.log(`name`,this.new_restaurant.restaurant_name.length);
      console.log(`desc`,this.new_restaurant.description.length);
      console.log(`cuisine`,this.new_restaurant.cuisine_type.length);

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

  createNewRestaurant() {
    this.backend_errors = null;
    let router = this.router;

    console.log(`trying to create new restaurant`,);
    if (!this.validateForm()) {
      let observable = this._http.createRestaurant(this.new_restaurant);
      observable.subscribe(response => {
        console.log(`response from server for create restaurant: `, response);
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

}
