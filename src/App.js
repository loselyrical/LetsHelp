import {useEffect} from "react";
import {getAllFunding, loadAccount, loadCrowdFundingContract, loadWeb3} from "./redux/interactions";
import {useDispatch} from "react-redux";
import {chainOrAccountChangedHandler} from "./helper/helper";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import {Route, Routes} from "react-router-dom";
import MyContributions from "./components/MyContributions";
import ProjectDetails from "./components/ProjectDetails";

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        loadBlockchain()
    }, [])

    const loadBlockchain = async () => {
        const web3 = await loadWeb3(dispatch)
        await loadAccount(web3, dispatch)
        const crowdFundingContract = await loadCrowdFundingContract(web3, dispatch)
        await getAllFunding(crowdFundingContract, web3, dispatch)
    }

    useEffect(() => {
        window.ethereum.on('accountsChanged', chainOrAccountChangedHandler);
        window.ethereum.on('chainChanged', chainOrAccountChangedHandler);
    }, [])

    return (
        <Layout>
            <Routes>
                <Route path="/my-contribution" element={<MyContributions/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/project-details/:id" element={<ProjectDetails/>}/>
                <Route path="/" element={<Dashboard/>}/>
            </Routes>
        </Layout>
    );
}

export default App;
