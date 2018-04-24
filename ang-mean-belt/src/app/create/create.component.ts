import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {DataManagerService} from "../data-manager.service";


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

  ngOnInit() {
  //set the values for a new thing
    this.new_thing = {
      name: '',
      details: '',
      attribute_one: '',
      attribute_two: '',
      attribute_three: '',
      skills: [this.skill_one, this.skill_two, this.skill_three]
    };

  }

  logChange(change_item: HTMLInputElement) {
    console.log(`Item changed: `,change_item);
    console.log(`ViewModel: `,change_item['viewModel']);
  }


  validateForm() {
    console.log(`checking form for valid inputs`,);
    if (this.new_thing.name.length &&
      this.new_thing.description.length &&
      this.new_thing.type.length) {
      console.log(`invalid form data`,);
      return true;
    } else {
      console.log(`valid form data`,);
      return false;
    }

  }

}
