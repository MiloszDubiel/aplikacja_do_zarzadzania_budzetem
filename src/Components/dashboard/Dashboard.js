import React, { useEffect, useState } from "react";
import "./dashboard-style.css";
import ForbiddenContent from "../forbidden/Forbedden";
import { TbMoneybag } from "react-icons/tb";
import { HiArrowSmallUp, HiArrowSmallDown } from "react-icons/hi2";
import axios from "axios";
import { IoSettingsOutline } from "react-icons/io5";

const Dashboard = () => {
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  let emailFromCookie = document.cookie.substr(6);
  let [transactionsData, setTransactionsData] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:3001/history", {
        userID: JSON.parse(window.localStorage.getItem("userData")).id,
      })
      .then((res) => {
        setTransactionsData(res.data);
      });
  }, []);

  const spentMoney =
    typeof transactionsData.filter != "function"
      ? 0
      : transactionsData
          .filter((element) => element.type === "Wydatki")
          .reduce((x, { amount }) => x + amount, 0);

  const incomMoney =
    typeof transactionsData.filter != "function"
      ? 0
      : transactionsData
          .filter((element) => element.type === "Przychody")
          .reduce((x, { amount }) => x + amount, 0);

  const content =
    emailFromCookie === userData.email || userData.email != undefined ? (
      <section id="content">
        <main>
          <div className="head-title">
            <div className="left">
              <h1>Dashboard</h1>
              <ul className="breadcrumb">
                <li>
                  <a href="#">Dashboard</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>
                </li>
              </ul>
            </div>
            <a
              onClick={() =>
                document.querySelector(".user-setting").classList.add("show")
              }
              className="btn-download"
            >
              <IoSettingsOutline />
            </a>
          </div>

          <ul className="box-info">
            <li>
              <i className="bx bxs-calendar-check">
                <TbMoneybag />
              </i>
              <span className="text">
                <h3>Stan konta</h3>
                <p>{userData.balance} zł</p>
              </span>
            </li>
            <li>
              <i className="bx bxs-group">
                <HiArrowSmallUp />
              </i>
              <span className="text">
                <h3>Wydatki</h3>
                <p>{spentMoney}zł</p>
              </span>
            </li>
            <li>
              <i className="bx bxs-dollar-circle">
                <HiArrowSmallDown />
              </i>
              <span className="text">
                <h3>Przychody</h3>
                <p>{incomMoney}zł</p>
              </span>
            </li>
          </ul>

          <div className="table-data">
            <div className="order">
              <div className="head">
                <h3>Histora</h3>
                <i className="bx bx-search"></i>
                <i className="bx bx-filter"></i>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Kategoria</th>
                    <th>Data transakcji</th>
                    <th>Typ</th>
                    <th>Opis</th>
                    <th>Kwota</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p>John Doe</p>
                    </td>
                    <td>01-10-2024</td>
                    <td>
                      <span className="status incom">Przychody</span>
                    </td>
                    <td>Wypłata</td>
                    <td>2500 zł</td>
                  </tr>
                  <tr>
                    <td>
                      <p>John Doe</p>
                    </td>
                    <td>02-10-2024</td>
                    <td>
                      <span className="status spend">Wydatki</span>
                    </td>
                    <td>Karma dla kota</td>
                    <td>70 zł</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="profile-card">
              <div className="image">
                <img src="" alt="" className="profile-pic" />
              </div>
              <div className="data">
                <h2>{userData.name + " " + userData.lastname}</h2>
              </div>
              <div className="row">
                <div className="user-info">
                  <h3>Email:</h3>
                  <span>{userData.email}</span>
                </div>
                <div className="user-info">
                  <h3>Data dołączenia: </h3>
                  <span>
                    {userData === null
                      ? ""
                      : userData.created_at.substring(
                          0,
                          userData.created_at.indexOf("T")
                        )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>
    ) : (
      <ForbiddenContent />
    );

  return <>{content}</>;
};

export default Dashboard;
