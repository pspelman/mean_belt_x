import { Component, OnInit } from '@angular/core';
import {DataManagerService} from "../data-manager.service";
import {ActivatedRoute, Router} from "@angular/router";



@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  private belt_test_model_data: any;
  belt_test_model_id: any;

  constructor(private _http: DataManagerService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.belt_test_model_id = params['belt_test_model_id'];
      console.log(`Grabbed the belt_test_model id: `,this.belt_test_model_id);
    });

  }

  backend_errors: any;
  name: any;
  attribute_one: any;
  attribute_two: any;
  attribute_three: any;
  details: any;
  skill_one: string = "";
  skill_two: string = "";
  skill_three: string = "";
  skills: Array<any>;


  selected_belt_test_model: {
    id: null,
    name: null,
    type: null,
    description: null,
    // skills: [this.skill_one, this.skill_two, this.skill_three],
  };


  ngOnInit() {
    //get the requested belt_test_model
    let observable = this._http.getBeltTestModelById(this.belt_test_model_id);
    observable.subscribe(data => {
      console.log(`Query for specific pet returned: `, data);
      this.belt_test_model_data = data['pet'][0];
      this.selected_belt_test_model.id = data['pet'][0]._id;
      this.selected_belt_test_model.name = data['pet'][0].pet_name;
      this.selected_belt_test_model.type = data['pet'][0].type;
      this.selected_belt_test_model.description = data['pet'][0].description;
      // this.selected_belt_test_model.skills[0] = data['pet'][0].skills[0].skill;
      // this.selected_belt_test_model.skills[1] = data['pet'][0].skills[1].skill;
      // this.selected_belt_test_model.skills[2] = data['pet'][0].skills[2].skill;
    })
  }


  logChange(change_item: HTMLInputElement) {
    console.log(`Item changed: `,change_item);
    console.log(`ViewModel: `,change_item['viewModel']);
  }
}
