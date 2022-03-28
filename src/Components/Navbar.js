import React from "react";
import "./styles/Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar(props) {
  const logout = props.logOut;

  const toggleSidebar = () => {
    let primaryNav = document.querySelector(".primary-navigation");
    let navToggle = document.querySelector(".mobile-nav-toggle");
    const btnVisibility = primaryNav.getAttribute("data-visible");
    console.log(btnVisibility);
    if (btnVisibility === "true") {
      navToggle.setAttribute("aria-expanded", false);
      primaryNav.setAttribute("data-visible", false);
    } else {
      primaryNav.setAttribute("data-visible", true);
      navToggle.setAttribute("aria-expanded", true);
    }
  };

  const changeLiClass = (el) => {
    // find all the elements in your navbar and loop over them
    console.log(el);
    Array.prototype.slice
      .call(document.querySelectorAll(".primary-navigation li"))
      .forEach(function (element) {
        // remove the active class
        element.classList.remove("active");
      });
    // add the active class to the element that was clicked
    el.currentTarget.classList.add("active");
  };

  return (
    <div className="navbar">
      <div className="title">Cymail</div>
      <button
        className="mobile-nav-toggle"
        aria-controls="primary-navigation"
        aria-expanded="false"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Menu</span>
      </button>
      <nav>
        <ul
          id="primary-navigation"
          data-visible="false"
          className="primary-navigation flex"
        >
          <li onClick={changeLiClass}>
            <Link className="react-link" to="/inbox">
              <span aria-hidden="true">00</span>Inbox
            </Link>
          </li>
          <li onClick={changeLiClass}>
            <Link className="react-link" to="/compose">
              <span aria-hidden="true">01</span>Compose
            </Link>
          </li>
          <li onClick={logout}>
            <Link className="react-link" to="/">
              <span aria-hidden="true">03</span>Log Out
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
