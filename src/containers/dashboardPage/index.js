import CustomContainer from '../../components/customContainer';
import Layout from '../../components/layout';
import { useQuery } from '@apollo/client';
import './style.scss';
import wallet from "../../assets/dashboard/walletFilled.png"
import { STATS } from '../../gqlQueries';
import { CircularProgress } from '@material-ui/core';

const Dashboard = () => {
    const {loading:loading, data, error:error, refetch} = useQuery(STATS);
    console.log(data, "stats")
    if(loading) {
        return (<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <CircularProgress />
                </div>
        );
    }
    if(error){
        return(
            <h1>Not Found</h1>
        )
    }
    return(
        <CustomContainer>
            <Layout/>
            <div className={'dashboard-title'}>
                <h1>Dashboard</h1>
            </div>
            <div className={'data'}>
                <div className={'data-box'}>
                    <span className={'label'}>Overall Income</span>
                    <div className={'stat-box'}>    
                        <span className={'stat-name'}>{data.stats.overallIncome} <b>BUSD</b></span>
                    </div>
                </div>
                <div className={'data-box'}>
                    <span className={'label'}>Active Contracts</span>
                    <div className={'stat-box'}>
                        <span className={'stat-name'}>{data.stats.activeContracts}</span>
                    </div>  
                </div>
                <div className={'data-box'}>
                    <span className={'label'}>Overall Outcome</span>
                    <div className={'stat-box'}>
                        <span className={'stat-name'}>{data.stats.overallOutcome} <b>BUSD</b></span>
                    </div>
                </div>
                <div className={'data-box'}>
                    <span className={'label'}>Closed Contracts</span>
                    <div className={'stat-box'}>
                        <span className={'stat-name'}>{data.stats.closedContracts}</span>
                    </div>
                </div>
                <div className={'data-box'}>
                    <span className={'label'}>Net Profit</span>
                    <div className={'stat-box'}>
                        <span className={'stat-name'}>{data.stats.netProfit} <b>BUSD</b></span>
                        <img src={wallet}/>
                    </div>
                </div>
                <div className={'data-box'}>
                    <span className={'label'}>Frozen Contracts</span>
                    <div className={'stat-box'}>
                        <span className={'stat-name'}>{data.stats.frozenContracts}</span>
                    </div>
                </div>
            </div>
        </CustomContainer>
    )
}

export default Dashboard;