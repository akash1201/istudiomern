import Axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { Container, Row, Col, Button,Tabs, Tab } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listOrders } from '../actions/orderActions'
import SideBar from "../components/Sidebar"
import Loader from '../components/Loader'
import { Empty, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Input, Space, Select } from 'antd';
import Paginate from '../components/Paginate'
import ReceivedOrderSteps from '../components/ReceivedOrderSteps'

const OrderReceived = ({ match,history }) => {
  const dispatch = useDispatch()

  let pageNo = match.params.pageNo || 1
  const { Option } = Select;
  
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin


  const [loading, setLoading] = useState(()=>true)
  const [allOrders, setAllOrders] = useState(()=>[])
  const [pages, setPages] = useState(()=>0)

  const [vendors, setVendors] = useState(()=>[])

  if(!userInfo){
            history.push('/login')
  }

  useEffect(() => {
    if (userInfo && (userInfo.userType == 'admin' || userInfo.userType == 'vendor')) {
      dispatch(listOrders())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo])

  useEffect(()=>{
    getAllOrders()
    document.title = 'All Orders'
  },[pageNo])

  const getAllOrders = async () => {

          setLoading(true)
          window.scrollTo(0,0)
    let config = {
      headers:{
        Authorization: `Bearer ${userInfo.token}`
      }
    }
  if(userInfo.userType == 'admin'){
            setLoading(true)
    let response = await Axios.get(`/api/orders/${pageNo}`, config)
    setAllOrders(response.data.orders)
    setPages(response.data.pages)

    let response1 = await Axios.get(`/api/users/vendors`, config)
    let data = []
    for(let i=0; i<response1.data.length; ++i){
      let name = response1.data[i].name
      if(response1.data[i].lastName){
        name = name+" "+response1.data[i].lastName
      }
         data = [...data, name]
    }
    setVendors(data)
    setLoading(false)
  }
  }


  const [searchText, setSearchText] = useState(()=>'')
  const [searchedColumn, setSearchedColumn] = useState(()=>'')
  const searchInput = useRef('')

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      
      <div style={{ padding: 8 }}>
        {
          dataIndex == 'vendor'?
          <Select
              ref={searchInput}
              showSearch
              style={{ width: 200 }}
              placeholder={`Search ${dataIndex}`}
              onChange={e => setSelectedKeys(e ? [e] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ marginBottom: 8, display: 'block' }}        
            >
              {
                vendors.map((e,i)=>(
                 <Option key={i} value={e}>{e}</Option>
                ))
              }
            </Select>
          :
          <Input
         ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        }
        
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        // setTimeout(() => searchInput.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
       text
      ) : (
        text
      ),
  });

 const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    
      setSearchText(selectedKeys[0])
      setSearchedColumn(dataIndex)
   
  };

 const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  }

  const columns1 = [
    {
      title: 'Product Image',
      dataIndex: 'productImage',
      key: 'productImage',
      width: '10%',
      render: (text, e) => {
        return(
           <img src={e.productImage} style={{width: '100%'}}/>
        )
      }
    },
    {
      title: 'Product Name',
      dataIndex: 'variantName',
      key: 'variantName',
      ...getColumnSearchProps('variantName'),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
      width: '15%',
      ...getColumnSearchProps('vendor'),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      ...getColumnSearchProps('price'),
    },
   { 
     title: 'Quantity',
    dataIndex: 'qty',
    key: 'qty'
  },
    {
      title: 'Shipping Address',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
      render: (text, e) => {
        return(
          e.shippingAddress.name+", "+e.shippingAddress.address+", "+e.shippingAddress.city+", ZIP:"+e.shippingAddress.postalCode
        )
      },
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (text, e) => {
        return(
          e.createdAt.split("T")[0].split("-")[2]+"-"+e.createdAt.split("T")[0].split("-")[1]+"-"+e.createdAt.split("T")[0].split("-")[0]
        )
      },
    },
  ];


  return (
    <>
      <section className="accountMain-wraper">
        <Container>
          <Row>
            <div className="col-md-12">
              <h1 className="main-heading">My Account</h1>
            </div>
          </Row>
          <Row>
            <SideBar />
            <Col md={12} lg={9} xl={9}>
              <div className="paymentMethod-main myorder-info full-size">
                <h4 className="heading">All Orders Received</h4>
                <ReceivedOrderSteps />
                  {loading ? (
                  <Loader />
                ) : (                 
                    <>
                      <Table 
                         columns={columns1}
                         dataSource={allOrders}
                         rowKey={'_id'}
                         pagination={false}
                      />
                      <Paginate url='/admin/all-orders' page={pageNo} pages={pages}/>
                    </>
                    )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
    </>
  )
}

export default OrderReceived
