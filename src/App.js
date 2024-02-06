import React, { useEffect, useState } from 'react';
import { fetchUsers } from './services/SortService';
import './App.css';
import worker from './app.worker.js';
import WebWorker from './WebWorker';
import {
    MDBBtn
  } from 'mdb-react-ui-kit';

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const webWorker = new WebWorker(worker);

    useEffect(() => {
        fetchUsers().then(users => {
            setUsers(users);
            setIsLoading(false);
        });

        return () => {
            webWorker.terminate()
        }
    }, []);

    

    const sortAscending = () => {
        webWorker.postMessage({ users, type: "asc"});

        setIsSorting(true);

        webWorker.addEventListener('message', (event) => {
            const sortedList = event.data;

            setUsers(sortedList);
            setIsSorting(false);
        });

        return;
    }

    const sortDescending = () => {
        webWorker.postMessage({ users, type: "desc"});

        setIsSorting(true);
        
        webWorker.addEventListener('message', (event) => {
            const sortedList = event.data;

            setUsers(sortedList);
            setIsSorting(false);
        });
    }

    const renderUsers = () => {
        return users.map((user, index) => {
            return (
                <div key={index} className="card mt-4 mb-4  p-25 ">
                    <div className="card-header">
                        <b>Name:</b> {user.name}
                    </div>
                    <div className="card-body mt-4 p-5">
                        <b>Email:</b> {user.email}
                        <p className="card-text mt-4 ">
                           <b>Joined: </b> {user.joinedOn.toString()}
                        </p>

                    </div>
                    <div className="card-footer text-visible">
                        {user.commentCount} comments
                        {user.data} 
                    </div>
                </div>
            );
        });
    }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-5 p-5">
                        <div className="btn-group mr-2 mt-2 " role="group" aria-label="Basic example">
                            <MDBBtn
                                onClick={sortAscending}
                                type="button"
                                style={{backgroundColor:"aqua"}}
                                disabled={isLoading}>
                                Sort Ascending
                            </MDBBtn>
                        </div>

                        
                        <div className="btn-group mt-2" style={{ marginLeft: '10px' }} role="group" aria-label="Basic example">
                            <MDBBtn
                                onClick={sortDescending}
                                type="button"
                                style={{backgroundColor:"navy"}}
                                disabled={isLoading}>
                                Sort Descending
                            </MDBBtn>
                        </div>
                    </div>
                </div>
            
                {isSorting && <div className="mt-4 p-3">
                            Sorting ...
                        </div>}

                {isLoading &&
                    <div className="mt-4 p-3">
                        Loading ...
                    </div>
                }

                {!isLoading &&
                        <div className="col-md-12 p-5">
                            <h3 style={{marginTop:"20px",fontWeight:"bolder", background:"grey" , color:"black", fontFamily:"sans-serif", animation:"forwards", textAlign:'center'}} >Fake Data</h3>
                            {renderUsers()}
                        </div>
                }
            </div>
        );
}

export default App;