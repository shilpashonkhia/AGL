import { Component } from '@angular/core';
import { ApiService } from './api.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  people: any = [];
  constructor(private api: ApiService) {}
  title = 'app';

  getPeople() {
    this.api.getPeoples()
      .subscribe(data => {
        for (const d of (data as any)) {
          this.people.push({
            name: d.name,
            gender: d.gender
          });
        }
        console.log(this.people);
      });
  }

  public startUp() {
    return new Promise((resolve, reject) => {
      this.api.getPeoples().subscribe(
            data => resolve(this.render(this.fetchCats(data))),
            error => resolve('<div class="error"> Error : ' + error + '</div>')
        );
    });
}



  public createTemplate(obj) {
    let def = '';
    if (obj && obj.name && obj.userName) {
        def = `<div class="card"><div class="container"><h4>Pet Name : ${obj.name}</h4><p> Owner : ${obj.userName}</p></div></div>`;
    }
    return def;
}

public render(data): string {
  if (data === undefined) {
      return '<div class="nodata">no data found</div>';
  }
  const catsDom = this.createCats(data.maleList, 'male') + this.createCats(data.femaleList, 'female');
  //this.htmlToAdd =  catsDom !== '' ? catsDom : '<div class="nodata">no data found</div>';
}

public createCats(list, type) {
  if (list === undefined || !Array.isArray(list) || type === undefined || type === '') {
      return '';
  }
  const template = list.map(item => this.createTemplate(item)).join('');
  return '<div class="header ' + type + '">' + type + '</div>' + template;
}
  public sortCats(list) {
    if (list === undefined || !Array.isArray(list) || list.length === 0) { return []; }
    return list.sort(this.sortObject('name', 'asc'));
  }

  public fetchCats(data): { maleList?: any[], femaleList?: any[] } {
    if (data === undefined) {
        return {};
    }
    const catArray = this.parseData(data);
    if (catArray.length === 0) {
        return {};
    }
    return {
        maleList: this.sortCats(this.filterCats(catArray.filter(item => item.userGender === 'Male'))),
        femaleList: this.sortCats(this.filterCats(catArray.filter(item => item.userGender === 'Female')))
    };
}

public parseData(data) {
  if (data === undefined || !Array.isArray(data) || data.length === 0) {
      return [];
  }
  const cats = data.reduce((collection, owner) => {
      if (owner.pets) {
          const pets = owner.pets.map((pet) => {
              const userMergedPet: Pets = {};
              (<any>Object).assign(userMergedPet, pet);
              userMergedPet.userName = owner.name;
              userMergedPet.userGender = owner.gender;
              return userMergedPet;
          });
          return collection.concat(pets);
      } else {
          return collection;
      }
  }, []);
  return cats;
}

  public sortObject(property, order) {
    if (property === undefined || order === undefined || property.length === 0 || order.length === 0) {
        return;
    }
    let sortOrder = 1;
    if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
    }
    return (a, b) => {
        let result;
        if (order.toLowerCase() === 'asc') {
            result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        } else {
            result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
        }
        return result * sortOrder;
    };
}

  public filterCats(cats) {
    if (cats === undefined || !Array.isArray(cats) || cats.length === 0) { return []; }
    return cats.filter((item) => item.type.toLowerCase() === 'cat');
  }
}

interface Pets {
  userName?: string;
  userGender?: string;
  name?: String;
  type?: string;
}
