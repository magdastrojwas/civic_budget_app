import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom'

import '../scss/main.scss';


import {Router,
    Route,
    Link,
    IndexLink,
    IndexRoute,
    hashHistory
} from 'react-router';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            user: null
        }
    }

    handleLoggedIn = (user) => {
        this.setState({user: user});
    };

    render() {
        const MyHome = () => <Home onLoggedIn={this.handleLoggedIn} />;
        const MyVote = () => <Vote user={this.state.user} />;
        return (
            <div id='mainTemplate'>
                <main className="container">Aplikacja Budżet Obywatelski</main>
                <Router history={hashHistory}>
                    <Route path='/' component={MyHome} />
                    <Route path='/admin' component={AdminTemplate}>
                        <Route path='zatwierdz' component={Confirmation}/>
                        <Route path='zglos' component={Propose}/>
                    </Route>
                    <Route path='/user' component={UserTemplate}>
                        <Route path='zglos' component={Propose}/>
                        <Route path='glosowanie' component={MyVote}/>
                    </Route>
                    <Route path='*' component={NotFound}/>
                </Router>
            </div>
        );
    }
}

class AdminTemplate extends React.Component {

    render() {
        return (
            <div>
                <nav className="container">
                    <ul className="navbarList">
                        <li>
                            <IndexLink to='/'>Home</IndexLink>
                        </li>
                        <li>
                            <Link to='/admin/zatwierdz'>Zatwierdzanie projektów przez administratora</Link>
                        </li>
                        <li>
                        <Link to='/admin/zglos'>Zgłaszanie projektów</Link>
                    </li>
                    </ul>
                </nav>
                {this.props.children}
            </div>
        );

    }
}

class UserTemplate extends React.Component {

    render() {
        return (
            <div>
                <nav className="container">
                    <ul className="navbarList">
                        <li>
                            <IndexLink to='/'>Home</IndexLink>
                        </li>
                        <li>
                            <Link to='/user/zglos'>Zgłaszanie projektów</Link>
                        </li>
                        <li>
                            <Link to='/user/glosowanie'>Głosowanie</Link>
                        </li>
                    </ul>
                </nav>
                {this.props.children}
            </div>
        );

    }
}


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            mail:'',
            pwd:'',
            infoText:'',
        }
    }

    static get contextTypes() { //obsługa przekierowania
        return {
            router: React.PropTypes.object.isRequired,
        };
    }

    render() {

        return (
            <div className="container">
                <h1>Witaj na stronie, zaloguj się!</h1>
                <div className='panel'>
                    <form onSubmit={this.handleLogIn}>
                        <label htmlFor="email">E-mail:</label>
                        <input type="email" id="email" name="e_mail" value={this.state.mail} onChange={this.handleChangeMail}/>
                        <label htmlFor="password">PESEL:</label>
                        <input type="password" id="password" name="password" value={this.state.pwd} onChange={this.handleChangePwd}/>
                        <div className="lower">
                            <input type="submit" value="Zaloguj"/>
                        </div>
                    </form>
                </div>
                <div className="infoText">{this.state.infoText}</div>
            </div>);
    }

    handleChangeMail = (event) => {
        this.setState({
            mail: event.target.value
        })
    };

    handleChangePwd = (event) => {
        this.setState({
            pwd: event.target.value
        })
    };

    handleLogIn = (event) => {
        event.preventDefault();

        // let userUrl= 'http://localhost:3000/users?mail=' +this.state.mail+'&pesel='+this.state.pwd;

        fetch('http://localhost:3000/users?mail=' + this.state.mail).then(resp => {
            if(resp.ok) {
                return resp.json();
            } else
                throw new Error('Błąd sieci!');
        }).then(users => {
            // console.log(users, users.length);
                this.setState({
                    infoText: users.length === 0 ? 'Nie ma takiego użytkownika!' : ''
                });

            let user = users[0]; //zmienna przykładowego użytkownika
            if (user.pesel !== this.state.pwd) {
                this.setState({
                    infoText: 'Nieprawidłowe hasło!'
                })
            } else {
                this.props.onLoggedIn(user);

               if(user.type === 'user') {
                   this.context.router.push('/user/zglos')
               }
               else this.context.router.push('/admin/zatwierdz')
            }
        }).catch (err => {
            console.log('Błąd', err);
        })
    }
}



class Propose extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            title: '',
            description: '',
            price: '',
            disabled:false,
            info:''
        }
    }
    render() {

        return (
            <div className='container'>
                <h1>Zgłoś swój projekt - wypełnij formularz</h1>
                <div className="proposePanel">
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="text">Nazwa projektu:</label>
                        <input type='text' id="name" placeholder="wpisz nazwę" value={this.state.title} onChange={this.handleChangeTitle}/>
                        <label htmlFor="number">Szacunkowy koszt:</label>
                        <input type='number' id= "price" placeholder='podaj kwotę' value={this.state.price} onChange={this.handleChangePrice}/> <br/>
                        <label htmlFor="text">Opis projektu:</label>
                        <textarea id="description"  placeholder='opis'value={this.state.description} onChange={this.handleChangeText}></textarea><br/>
                        <div className="lower">
                            <input type='submit' value='ZGŁOŚ PROJEKT' disabled={this.state.disabled}></input>
                        </div>
                    </form>
                </div>
                <div className="infoText">{this.state.info}</div>
            </div>
        );

    }

    handleChangeTitle =(event) => {
        this.setState({
            title: event.target.value
        });
    };

    handleChangePrice = (event) => {
        this.setState({
            price: event.target.value
        });
    };

    handleChangeText = (event) => {
        this.setState({
            description: event.target.value
        })
    };

    handleSubmit = (event) => {
        event.preventDefault();


        if(this.state.title ==='') {
            this.setState({info: 'Podaj nazwę projektu'});
            return;
        }
        else if(this.state.price ==='') {
            this.setState({info: 'Podaj szacunkowy koszt realizacji projektu'});
            return;
        }
        else if(this.state.description === '') {
            this.setState({info: 'Uzupełnij opis projektu'});
            return;
        }



        const newProject = {
            name: this.state.title,
            description: this.state.description,
            status: "Z",
            koszt:this.state.price,
            id:null
        };

        fetch('http://localhost:3000/projects', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(newProject)
        }).then(data => {
            this.setState({
                title:'',
                price:'',
                description: '',
                disabled: true,
                info: 'Projekt został zgłoszony i zostanie poddany weryfikacji'
            })
            })
    }
}


class Confirmation extends React.Component{
    constructor(props){
        super(props);
        this.state={
            projects: null,
            acceptedProjectIds: []
        };
    }

    render() {
        if(!this.state.projects) //jeśli nie ma żadnych danych to nie renderuje komponentu
            return null;

        let listOfProjects= this.state.projects.map(el => <li className="project" key={el.id}> <strong style={{color: this.state.acceptedProjectIds.indexOf(el.id) > -1 ? 'red' : 'black'}}>{el.name} </strong>
            <button  className="btn" onClick={() => this.handleClick(el.id)} disabled={this.state.acceptedProjectIds.indexOf(el.id) > -1}>ZMIEŃ STATUS</button> <span style={{display: this.state.acceptedProjectIds.indexOf(el.id) > -1 ? '' : 'none'}}>Zmieniono status</span> <br/>
            {el.description} <br/>
            KOSZT: <strong>{el.koszt} zł</strong></li>);

        return (
            <div className='container'>
                <h1>Zatwierdzanie projektów</h1>
                <div className="list">
                    <ul className="projectList">
                        {listOfProjects}
                    </ul>
                </div>
            </div>)
    }


    handleClick =(id) => {  //na klik zmieniam status i dodaję do tablicy zaakceptowanych
        // console.log(id);

        const newStatus= {
            status: "A"
        };

        fetch('http://localhost:3000/projects/' +id, {   //zmieniam w db status na A
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(newStatus)
        }).then(data => {
            this.setState(prevState => ({
                acceptedProjectIds: [...prevState.acceptedProjectIds, id]
            }));
        })
    };

    componentDidMount() {

        fetch('http://localhost:3000/projects').then(resp => { //pobieranie projektów
            if (resp.ok)
                return resp.json();
            else
                throw new Error('Błąd sieci!');
        }).then( data => {
            console.log(data);
            this.setState({
                projects: data
            })
        }).catch(err => {
            console.log('Błąd', err);
        });


    }
}

class Vote extends React.Component {
    constructor(props){
        super(props);
        this.state={
            projects: null,
            votedProjectId: null,
            userId: props.user.userId,
            canVote: true
        };
    }

    render() {
        if(!this.state.projects)
            return null;

        if(!this.state.canVote)
            return <b className="infoText">GŁOS ODDANY!</b>;

        let listOfProjects = this.state.projects.map(el => <li  className="project" key={el.id}> <strong style={{color: this.state.votedProjectId !== el.id ? 'black' : 'red'}}>{el.name} </strong>
            <button className="btn" onClick={() => this.handleClick(el.id)} disabled={this.state.votedProjectId == el.id}> Głosuję</button> <span style={{display: this.state.votedProjectId !== el.id ? 'none' : ''}}>Wybrano</span> <br/>
            {el.description} <br/>
            KOSZT: <strong>{el.koszt}</strong> </li>);

        return (
            <div className="container">
                <h1>Zagłosuj na wybrany projekt:</h1>
                <div className="list">
                    <ul className="projectList">
                        {listOfProjects}
                    </ul>
                    <button className="btnAccept" onClick={this.handleConfirmClick}>ZATWIERDŹ</button>
                </div>

            </div>
        )
    }

    handleClick = (id) => {  //klik, aby jeden był możliwy, a inne w tym momencie przestały być aktywne
        console.log('klik');
        this.setState({
            votedProjectId: id
        });
    };

    handleConfirmClick = () => { //po zagłosowaniu dodają info do kolekcji jsona kto zagłosował na co
        const newVote = {
            id: null,
            userId: this.props.user.userId,
            projectId: this.state.votedProjectId,
            points: 1
        };

        fetch('http://localhost:3000/votes', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(newVote)
        }).then(data => {
            this.setState({
                canVote: false
            })
        })
    };

    componentDidMount() { //jeśli ktoś głosował to info ze juz głosowałes, a jeśli jeszcze nie to dostaje to co poniżej

        fetch('http://localhost:3000/votes?userId=' + this.props.user.userId).then(resp => {
            if (resp.ok) {
                return resp.json();

            } else
                throw new Error('Błąd sieci!');
        }).then(votes => {
            console.log('Votes', votes);
            this.setState({canVote: votes.length === 0});
        });

        fetch('http://localhost:3000/projects?status=A').then(resp => {
            if (resp.ok)
                return resp.json();
            else
                throw new Error('Błąd sieci!');
        }).then( data =>
                // console.log('projekt: ', data);
                this.setState({
                    projects: data
                })
            ).catch(err => {
                console.log('Błąd', err);
            });


        }

}



function NotFound() {
    let style404 = {
      fontWeight: 'bold',
      fontSize: '50px',
      color: 'red'
    };
    return <h1 style={style404}>404 - nie znaleziono!</h1>
}

document.addEventListener('DOMContentLoaded', function(){
    ReactDOM.render(
        <App/>,
        document.getElementById('app')
    );
});