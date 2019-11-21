# School Demo
## Workflow
#### 1. Add Child to Parent Dashboard
![Add Child to Parent Dashboard](https://i.imgur.com/AX8xP1g.png)
#### 2. Open Child Dashboard in a new tab
![Open Child Dashboard in a new tab](https://i.imgur.com/H6pCIM9.png)

## Demo
1. Open https://edfinix.herokuapp.com/
2. Test Parent Accounts: 
  > username: 100, password: 100 <br />
  > username: 101, password: 101 <br />
3. Test Student Accounts:        
  > username: 11111, password: 12345  <br />
  > username: 11112, password: 12345  <br />
  > username: 11119, password: 12345  <br />
4. Login using any parent credentials, and you will be redirected to parent dashboard.
5. In parent dashboard, you can add a student using his/her credentials.
6. Enter credentials for any student in login field of parent dashboard, to add student.
7. After student is added to parent dashboard, just click on the student name to move to student's dashboard.

## Schema design of parent

```js
{
    parentId: {
        type: String,
        required: true
    },
    fatherName: String,
    motherName: String,
    fatherOccupation: String,
    motherOccupation: String,
    phoneNo: String,
    nationality: String,
    presentAddress: String,
    permanentAddress: String,
    childs: [ {
        username: String,
        password: String,
        firstName: String
    } ]
}
```
Here, parentId is a unique field(checkout [parent model](https://github.com/Brijesh59/school-demo/blob/master/server/models/parent.js) for more details) & it will also be served as username for every parent.
<br />
childs is an array, containing list of students, with their username, password & firstName. firstName is stored here, not referenced to student database, because of two reasons: <br />
a) refrencing (relationship) decreases the performance, so if not necessary, should be avoided.
b) we only need student name to show in parent dashboard, so we can store in parent database.

## Features

1. Student dashboard opens in a new page, when a student is clicked from parent's dashboard. It helps in persisting parent dashboard, so parent can switch back & forth. (check the logic for this in [Parent Dashboard](https://github.com/Brijesh59/school-demo/blob/master/client/src/Components/Parent/Dashboard.js))
2. Student dashboard is temporary, so when page with student dashboard reloads, parent dashboard is loaded.



