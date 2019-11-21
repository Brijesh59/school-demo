import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Typography, Divider, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';

const styles = theme => ({
  root:{
    margin: theme.spacing.unit * 3,
  },
  container: { 
    textAlign: 'center',
    width: '22%',
    // height: '50%',
    paddingTop: '20px',
    paddingBottom: '20px',
    fontFamily: 'Lato',
    position: 'fixed',
    [theme.breakpoints.down('sm')]: {
      width: '95%',
      position: 'static',
      marginBottom: '10px'
    },
  },
  studentList:{
      position: "relative", 
      [theme.breakpoints.down('sm')]: {
        width: '95%',
        position: 'static'
      },
  },
  textField: {
    marginLeft:'20px',
    marginRight: '20px',
    width: '85%',
  },
  card: {
      minWidth: 275,
      marginBottom: '10px',
      fontFamily: 'Lato',
      '&:hover':{
        cursor: "pointer",
        background: "#e8e8e8"
      }
    },
  title: {
    fontSize: 14,
  },
  button:{
    width: '85%',
    marginTop: '15px'
  },
  paperWidthMd: {
    width: 270
  },
  colorInherit: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    // height: 48,
    padding: '6px 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  sizeSmall:{
    width: '100px'
  }
});


class Dashboard extends Component {

  state = {
    username: localStorage.getItem("username"),
    admissionNo: "",
    password: "",
    children: [],
  }

  componentDidMount(){
    this.fetchParentDetails()
  }

  fetchParentDetails = () => {
    fetch(`/api/parents/${this.state.username}`)
      .then( res => res.json())
      .then( data => {
        // console.log("Childs: ", data.parent[0].childs)
          this.setState({
            children: data.parent[0].childs
          })
      })
      .catch(error => {
        alert("Something Went wrong in fetchParent: ", error)
      })
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleAddChild = (event) => {
    event.preventDefault();

    // check is user is already there
     if( this.checkUserAlreadyPresent(this.state.admissionNo) ){
      return;
    }

    // check if user is valid
    this.checkUser(this.state.admissionNo, this.state.password)
      .then((isValidUser) => {
        if(isValidUser){
          this.getChildDetails(this.state.admissionNo)
            .then(data => {
              // console.log(data.student[0].firstName)
              this.addChild(data.student[0].firstName)
            })
        }
        else{
          alert("Wrong admissionNo or Password")
        }
      }) 
      .catch(error => {
        alert("Something Went wrong")
        return;
      })
  }

  addChild = (firstName) => {

    const childDetails = {
      username: this.state.admissionNo,
      password: this.state.password,
      firstName
    }

    fetch(`/api/parents/addChild/${this.state.username}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(childDetails)
      })
      .then( res => res.json())
      .then( data => { 
        console.log(data)
        this.fetchParentDetails()
      })
      .catch(error => console.log(error))
  }

  checkUser = (username, password) => {
    
    const credentials = {
      username,
      password
    }
    let isValidUser = false

    return fetch(`/api/login/checkCredentials`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(credentials)
      })
      .then( res => res.json())
      .then( data => {
        console.log(data.login)
        if(data.login.message === 0){
          return isValidUser
        }
        else if(data.login.message === 1){
          if(data.login.user === "student"){
            isValidUser = true
            return isValidUser
          }
          else{
            isValidUser = false
            return isValidUser
          } 
        }
      })
      
  }

  checkUserAlreadyPresent = (username) => {
    let children = this.state.children;
    for(let i = 0; i < children.length; i++){
      if(children[i].username == username){
        alert("Child already added")
        return true;
      }
    } 
    return false;
  }

  getChildDetails = (username) => {
    return fetch(`/api/students/${username}`)
      .then(res => res.json())  
  }

  handleChildClick = (child) => {
    this.checkUser(child.username, child.password)
    .then((isValidUser) => {
      if(isValidUser){
        this.props.handleChildRender(child.username)
      }
      else{
        alert("Password has changed. Removing Child")
        this.removeChild(child.username);
      }
    })
    .catch(error => {
      alert("Something Went wrong")
      return;
    })
  }

  removeChild  = (username) => {
    // route not implemented
  }
 
  render() {
    const {classes} = this.props
    const children =  
        this.state.children.map((student, id)=>(
          <Card className={classes.card} key={id} 
              onClick={() => this.handleChildClick(student)} 
            >
            <CardContent>
                <Typography 
                  className={classes.title} 
                  color="primary" 
                  gutterBottom
                  >
                  {student.firstName}
                </Typography>   
            </CardContent>
          </Card>
        )
    )
    return(
      <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} lg={5} md={5}>
          <Paper className={classes.container}>
            <Typography style={{fontSize:'20px', marginBottom:'20px', fontFamily: 'Lato',}}>Add Student to Dashboard</Typography>
            <Divider />
            <form autoComplete="off" onSubmit={this.handleAddChild}>
                <TextField
                  required
                  name="admissionNo"
                  label="Admission No"
                  value={this.state.admissionNo}
                  className={classes.textField}
                  onChange={this.handleChange}
                  margin="normal"
                />
                <TextField
                  required
                  type="password"
                  name="password"
                  value={this.state.password}
                  label="Password"
                  className={classes.textField}
                  onChange={this.handleChange}
                  margin="normal"
                />
                <Button variant="contained" color="secondary"  className={classes.button} onClick={this.handleAddChild}>
                    Add
                </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={7} md={7}>
          <div className={classes.studentList} >
            {children}
          </div>
        </Grid>
      </Grid>   
    </div>
    )
  }
}

export default withStyles(styles)(Dashboard);
