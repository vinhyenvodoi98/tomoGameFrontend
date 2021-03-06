import React, { Component } from 'react'
import { Container, Col, Row, Button} from 'reactstrap'
// import '../../style/admin.css';
import * as insertActions from 'actions/insertquesAction'
import * as tomoActions from 'actions/tomoAction'
import store from 'store';
import firebase from 'config/config'
import '../App.css'
import 'style/admin.css'
// import { setQuestion } from '../../actions/tomoAction';


class AdminLayout extends Component {

    constructor(props){
        super(props)
        this.state ={
            selected : [],
            question : [],
        }
    }

    async componentWillMount(){
        var db = await firebase.firestore();
        db.collection("project_hunter").get().then((querySnapshot) =>{
            querySnapshot.forEach((doc) => {
                this.setState({question : [...this.state.question.concat([doc.data()])]})
            });
        });
    }

    selectQues = async (ques) =>{
        await this.setState({selected : [...this.state.selected.concat([ques.quesNumber])]});

        let found = await this.state.selected.find((element) =>{
            return element === ques.quesNumber
        })

        // console.log(this.state.question)
        await delete this.state.question[found];
        this.setState(this.state)
        store.dispatch(tomoActions.setQuestion(ques))
        store.dispatch(insertActions.insertQues(ques));
    }

    setSingleBounty = async() =>{
        await store.dispatch(tomoActions.shareQuestionBounty());
        console.log("share complite");
    }

    setAllBounty = async() => {
        await store.dispatch(tomoActions.shareBounty());
        console.log("share all bounty complte");
    }

    createGame = async() => {
        // debugger
        await store.dispatch(tomoActions.createNewGame());
        console.log("admin", store.getState().tomo.account)
    }

    render() {
        const {question} =this.state;
        return (
            <div>
                <Container>
                    <Col className="set_height">
                        <div className = "margin_box">
                            <div>
                                <h1>Select the next question</h1>
                            </div>
                            <div className="admin_question_box">
                                {
                                    question && question.map(ques => {
                                        return(
                                            <div className = "admin_quesbox" key = {ques.quesNumber}>
                                                <Button onClick={() => this.selectQues(ques)} className = "answer_box " outline color="primary" >{ques.question}</Button>
                                            </div>
                                        )}
                                )}
                            </div>
                            <div className ="button_bounty">
                                <Row>
                                    <Col>
                                        <Button onClick={()=>this.setSingleBounty()} color="primary">Single Question</Button>
                                    </Col>
                                    <Col>
                                        <Button onClick={()=>this.setAllBounty()}color="primary">All Bounty</Button>
                                    </Col>
                                    <Col>
                                        <Button onClick={()=>this.createGame()} color="primary">Create Game</Button>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Container>
            </div>
        );
    }
}

export default AdminLayout;