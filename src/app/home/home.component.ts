import { Component, ViewChild , ElementRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public pets: Pet[];
  @ViewChild('dataContainer') dataContainer: ElementRef;

  constructor(http: HttpClient) {
    http.get<Pet[]>('https://agl-developer-test.azurewebsites.net/people.json').subscribe(result => {
      this.render(this.fetchCats(result));
    }, error => console.error(error));
  }

  public render(data): string {
    if (data === undefined) {
        return '<div class="nodata">no data found</div>';
    }
    const catsDom = this.createCats(data.maleList, 'Male') + this.createCats(data.femaleList, 'Female');
    this.dataContainer.nativeElement.innerHTML = catsDom !== '' ? catsDom : '<div class="nodata">no data found</div>';

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

public createCats(list, type) {
  if (list === undefined || !Array.isArray(list) || type === undefined || type === '') {
      return '';
  }
  const template = list.map(item => this.createTemplate(item)).join('');
  return '<h1>' + type + '<h1>' + template;
}

public sortCats(list) {
  if (list === undefined || !Array.isArray(list) || list.length === 0) { return []; }
  return list.sort(this.sortObject('name', 'asc'));
}


public parseData(data) {
  if (data === undefined || !Array.isArray(data) || data.length === 0) {
      return [];
  }
  const cats = data.reduce((collection, owner) => {
      if (owner.pets) {
          const pets = owner.pets.map((pet) => {
              const userMergedPet: { userName: string, userGender: string } = {} as  { userName: string, userGender: string };
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

   public filterCats(cats) {
    if (cats === undefined || !Array.isArray(cats) || cats.length === 0) { return []; }
    return cats.filter((item) => item.type.toLowerCase() === 'cat');
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
  public createTemplate(obj) {
    let def = '';
    if (obj && obj.name && obj.userName) {
        def = `<div class="card"><div class="container"><h4>${obj.name}</h4></div></div>`;
    }
    return def;
}
}

export interface Pet {
  userName: string;
  userGender: string;
  name: String;
  type: string;
}
