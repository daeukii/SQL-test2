import styled from 'styled-components'
import React, { useEffect, useState } from "react";
import { db } from "../database/firebase";
import { collection, addDoc, query, getDocs, orderBy, startAt, endAt, getDoc, doc, deleteDoc} from "firebase/firestore";
require('moment-timezone');
const moment = require('moment');
moment.tz.setDefault('Asia/Seoul');


const AppWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const Book = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [memo, setMemo] = useState("");
    const [keyword, setKeyword] = useState("");
    const [bookList, setBookList] = useState([]);
    const [bookOne, setBookOne] = useState({});
    const [modal, setModal] = useState(false);
    const [currentId, setCurrentId] = useState("");
    const [memoTab, setMemoTab] = useState(false);

    useEffect(() => {
        getBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const insertBook = async () => {
        try {
            if(title === "" || author === "") {
                alert('제목 또는 저자를 입력하세요.');
                return;
            }
            const docRef = await addDoc(collection(db, "readingbooks"), {
                title : title,
                author : author,
                memo : "",
                done : false,
                startdate : moment().format('YYYY-MM-DD hh:mm:ss'),
                enddate : moment().format('YYYY-MM-DD hh:mm:ss'),
            });
            alert('추가 되었습니다.');
            console.log('Document written : ', docRef);
            setTitle("");
            setAuthor("");
            getBooks();
        }
        catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const getBooks = async () => {
        const bQuery = query(
            collection(db, "readingbooks"),
            orderBy("title"),
            startAt(keyword),
            endAt(keyword + "\uf8ff")
        );
        const querySnapshot = await getDocs(bQuery);
        let list = [];
        querySnapshot.forEach((doc) => {
            let id = doc.id;
            list.push({
                id : id,
                ...doc.data()
            })
        });
        setBookList(list);
        console.log('리스트 => ', bookList);
    };

    const selectBookOne = (e) => {
        let id = e.currentTarget.dataset.id;
        setCurrentId(id);
        console.log('id => ', id);
        getBookOne(id);
        setModal(true);
        setMemoTab(false);
        console.log(bookOne);
    };

    const handleSearch = () => {
        getBooks();
        setKeyword("");
    };

    const getBookOne = async (key) => {
        const querySnapshot = await getDoc(doc(db, "readingbooks", key));
        console.log(querySnapshot.data());
        setBookOne(querySnapshot.data());
    };

    const deleteBookOne = async () => {
        if(!window.confirm('삭제 하시겠습니까?')) {
            return
        }
        try {
            await deleteDoc(doc(db, "readingbooks", currentId));
            alert('삭제 되었습니다.')
            setModal(false);
            getBooks();
            setBookOne({});
        }
        catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    

    const offModal = (e) => {
        if(e.currentTarget === e.target) {
            setModal(false);
            setBookOne({});
        }
    };

    const handleMemo = (e) => {
        let str = e.target.value;
        setMemo(str);
    };
    const insertMemo = () => {
        console.log(currentId, memo);
    }


   

    const [userInput, setUserInput] = useState('');

    const handleClick = () => {
        const input = prompt('값을 입력하세요:');
        setUserInput(input);
      };
      

      const [user, setUsers] = useState();


    return (
        <AppWrapper>
        <div className="container">
            <div className="book-header">
                <div>
                    <h3>readingbooks 컬렉션</h3>
                    <h2>책 추가</h2>
                </div>
            </div>
            <div className="insert-container">
                <div>
                    <div className="insert-field">
                        <div className="insert-label">
                            책 이름 
                        </div>
                        <input type="text" value={title} onChange={(e) => {setTitle(e.target.value)}} />
                    </div>
                    <div className="insert-field">
                        <div className="insert-label">
                            작가이름 
                        </div>
                        <input type="text" value={author} onChange={(e) => {setAuthor(e.target.value)}} />
                    </div>
                    <div className="insert-field">
                        <div className="insert-label">
                        </div>
                        <button onClick={insertBook}>추가</button>
                    </div>
                </div>
            </div>
            <hr />
            <div style={{display:"flex", justifyContent : "end"}}>
                <input type="text" value={keyword} onChange={(e) => {setKeyword(e.target.value)}} />
                <button onClick={handleSearch}>검색</button>
            </div>
            <br />
            <div className="list-container">
            <table>
                    <thead>
                        <tr>
                            <th>제목</th>
                            <th>저자</th>
                            <th>등록일</th>
                            <th>감상문</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookList.length > 0 &&
                            bookList.map((tmp, idx) => 
                                <tr data-id={tmp.id} className="book-line" onClick={selectBookOne} key={idx}>
                                    <td>{tmp.title}</td>
                                    <td>{tmp.author}</td> 
                                    <td>{tmp.startdate}</td>
                                    <td><p>{userInput}</p></td>
                                    <td><button onClick={handleClick}>감상문 적기</button></td>
                                    <td><button>X</button></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            {modal && 
                <div onClick={offModal} className="modal-container">
                    <div className="modal-card">
                        <p>{currentId}</p>
                        <h3>{bookOne.title}</h3>
                        <p>{bookOne.author}</p>
                        <p>{bookOne.memo}</p>
                        <button onClick={() => setMemoTab(!memoTab)}>메모 보기</button>
                        {memoTab &&
                            <div>
                                <textarea onChange={handleMemo}>
                                </textarea>
                                <br />
                                <button onClick={insertMemo}>추가하기</button>
                            </div>
                        }
                        <br />
                        <button onClick={deleteBookOne}>삭제</button>
                    </div>
                </div>
            }
        </div>
        </AppWrapper>
    )
};

export default Book;