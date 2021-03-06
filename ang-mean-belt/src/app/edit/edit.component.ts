import { Component, OnInit } from '@angular/core';
import {DataManagerService} from "../data-manager.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RestaurantModel} from "../data-manager.service";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  restaurant_model: {
    id: null,
    name: null,
    type: null,
    description: null,
    // skills: [this.skill_one, this.skill_two, this.skill_three],
  };

  restaurant_data: any;
  restaurant_id: any;

  constructor(private _http: DataManagerService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.restaurant_id = params['restaurant_id'];
      console.log(`Grabbed the restaurant id: `,this.restaurant_id);
    });

  }

  backend_errors: any;

  selected_restaurant = new RestaurantModel();

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

  navHome() {
    this.router.navigateByUrl('/home');
  }


  logChange(change_item: HTMLInputElement) {
    console.log(`Item changed: `,change_item);
    console.log(`ViewModel: `,change_item['viewModel']);
  }

  validateForm() {
    console.log(`checking form for valid inputs`,);
    if (this.selected_restaurant.restaurant_name.length < 3 ||
      this.selected_restaurant.description.length < 3 ||
      this.selected_restaurant.cuisine_type.length < 3) {
      console.log(`name`,this.selected_restaurant.restaurant_name.length);
      console.log(`desc`,this.selected_restaurant.description.length);
      console.log(`cuisine`,this.selected_restaurant.cuisine_type.length);

      console.log(`invalid form data`,);
      return true;
    } else {
      console.log(`enough data to send`,);
      return false;
    }
  }


  //todo: make request to DB to update restaurant
  updateSelectedRestaurant() {
    this.backend_errors = null;
    let router = this.router;
    if (!this.validateForm()) {
      console.log(`trying to update restaurant`,);
      let observable = this._http.updateRestaurantInfo(this.restaurant_id, this.selected_restaurant);
      observable.subscribe(response => {
        console.log(`response from server for UPDATE restaurant: `, response);
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
