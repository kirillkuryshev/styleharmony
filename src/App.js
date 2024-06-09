import React from "react";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Items from "./components/Items";
import Categories from "./components/Categories";
import ShowFullItem from "./components/ShowFullItem";
import Checkout from "./components/Checkout";
import UserProfile from "./components/UserProfile"; 
import UserData from "./components/UserData";
import OrderHistory from "./components/OrderHistory"; // Импортируем OrderHistory
import AboutUs from './components/AboutUs'; // Импортируем AboutUs
import './index.css'; // Импортируем стили


const firebaseConfig = {
  apiKey: "AIzaSyAmynFq47_lcCUXlMVOg20UNSDCTRrsaj8",
  authDomain: "housestaffshop.firebaseapp.com",
  databaseURL: "https://housestaffshop-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "housestaffshop",
  storageBucket: "housestaffshop.appspot.com",
  messagingSenderId: "914371405589",
  appId: "1:914371405589:web:ab7921236a2de6a110eb1c",
  measurementId: "G-RZWJXMKKE1"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      currentItems: [],
      items: [],
      showFullItem: false,
      fullItem: {},
      showCheckout: false,
    };
    localStorage.setItem('isLoggedIn', false);

    this.addToOrder = this.addToOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.chooseCategory = this.chooseCategory.bind(this);
    this.onShowItem = this.onShowItem.bind(this);
    this.onCheckout = this.onCheckout.bind(this);
    this.onBack = this.onBack.bind(this);
    this.handleOrderConfirmed = this.handleOrderConfirmed.bind(this);
  }

  componentDidMount() {
    const itemsRef = ref(db);
    get(itemsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const itemsData = snapshot.val();
        const itemsArray = Object.values(itemsData);
        this.setState({ items: itemsArray, currentItems: itemsArray });
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error("Error getting data:", error);
    });
  }

  handleOrderConfirmed() {
    this.setState({ orders: [], showCheckout: false });
    toast.success('Заказ успешно оформлен!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  render() {
    if (this.state.showCheckout) {
      return (
        <>
          <Checkout
            orders={this.state.orders}
            onBack={this.onBack}
            onOrderConfirmed={this.handleOrderConfirmed}
          />
          <ToastContainer />
        </>
      );
    }

    return (
      <Router>
        <Switch>
          <Route path="/user-data" component={UserData} />
          <Route path="/order-history" component={OrderHistory} /> {/* Новый маршрут */}
          <Route path="/about" component={AboutUs} />
          <Route path="/">
            <div className="wrapper">
              <Header orders={this.state.orders} onDelete={this.deleteOrder} onCheckout={this.onCheckout} />
              <Categories chooseCategory={this.chooseCategory} />
              <Items onShowItem={this.onShowItem} items={this.state.currentItems} onAdd={this.addToOrder} />
              {this.state.showFullItem && <ShowFullItem onAdd={this.addToOrder} onShowItem={this.onShowItem} item={this.state.fullItem} />}
              <Footer />
              <ToastContainer />
            </div>
          </Route>
        </Switch>
      </Router>
    );
  }

  onShowItem(item) {
    this.setState({ fullItem: item });
    this.setState({ showFullItem: !this.state.showFullItem });
  }

  chooseCategory(category) {
    if (category === "all") {
      this.setState({ currentItems: this.state.items });
      return;
    }
    this.setState({
      currentItems: this.state.items.filter((el) => el.category === category),
    });
  }

  deleteOrder(id) {
    let updatedOrders = this.state.orders.map((order) => {
      if (order.item.id === id) {
        if (order.quantity > 1) {
          return { ...order, quantity: order.quantity - 1 };
        }
        return null;
      }
      return order;
    }).filter(order => order !== null);

    this.setState({ orders: updatedOrders });
  }

  addToOrder(item) {
    let isInArray = false;
    let updatedOrders = this.state.orders.map((order) => {
      if (order.item.id === item.id) {
        isInArray = true;
        return { ...order, quantity: order.quantity + 1 };
      }
      return order;
    });

    if (!isInArray) {
      updatedOrders = [...this.state.orders, { item, quantity: 1 }];
    }

    this.setState({ orders: updatedOrders });
  }

  onCheckout() {
    this.setState({ showCheckout: true });
  }

  onBack() {
    this.setState({ showCheckout: false });
  }
}

export default App;
