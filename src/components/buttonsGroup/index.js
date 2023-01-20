/* eslint-disable no-empty-pattern */
import React, {useState, memo} from 'react';
import ArrowRightIcon from '../../assets/buttonsGroup/arrow-right.svg';
import WalletIcon from '../../assets/buttonsGroup/wallet.png';
import CloseIcon from '../../assets/buttonsGroup/close.png';
import CrossIcon from '../../assets/buttonsGroup/cross.svg';
import closedisput from '../../assets/buttonsGroup/closedisput.png';
import {useHistory} from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import CancelModalIcon from '../../assets/buttonsGroup/cancelModal.svg';
import ContinueModalIcon from '../../assets/buttonsGroup/continue-modal-icon.svg';
import {REFUND_DISPUTE, CLOSE_DISPUTE} from "../../gqlQueries";
import {useMutation} from "@apollo/client";
import RetryIcon from '../../assets/buttonsGroup/retry-icon.svg';
import CancelModalWhiteIcon from '../../assets/buttonsGroup/cancelModalWhite.svg';
import CircularProgress from "@material-ui/core/CircularProgress";
import './styles.scss';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const ButtonsGroup = ({disputId, userId, providerId, agreementName, accuseType = '', disputeState}) => {
    const classes = useStyles();
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [openDisputModal, setOpenDisputModal] = useState(false);
    const [disp, setDisputeState] = useState(disputeState);
    const [refundDispute, {}] = useMutation(REFUND_DISPUTE, {errorPolicy: 'all'});
    const [closeDispute, {}] = useMutation(CLOSE_DISPUTE, {errorPolicy: 'all'});
    if(!disputeState){
        return (<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
            <CircularProgress />
            </div>
    );
    }
//   console.log("Dispute response state is " + JSON.stringify(disp));
//   console.log("Refund Dispute response is " + JSON.stringify(refundDisputeResponse));
    // useEffect(() => {
        // 
    //   }, [disputeState])
    const handleRefundDispute = async () => {
        try {   
            const result = await refundDispute({variables: {disputeId: disputId}});
            if (!!result?.errors?.length) setError(true);
            else handleCloseRefundDeal();
        } catch (error) {
            console.log('Refund dispute returns error: ' + error);
            return;
        }
        setDisputeState('REFUNDED');
    };

    const handleCloseDispute = async () => {
        try {   
            const result = await closeDispute({variables: {disputeId: disputId}});
            if (!!result?.errors?.length) setError(true);
            else handleCloseDisputModal();
        } catch (error) {
            console.log('Close dispute returns error: ' + error);
            return;
        }
        setDisputeState('CLOSED');
    };

    // const handleDispute = () => {
        // const {dispute, error, data} = useQuery(DISPUTE, { errorPolicy: 'all' });
        // dispute({variables: {disputeId: disputId}})
            // .then(result => {
                // if (!!result?.errors?.length) {
                //   setError(true)
                // } else {
                //   handleCloseDisputModal()
                // }
            // })
            // .catch(error => console.log(error))
    // };

    const handleOpenRefundDeal = () => {
        setOpen(true);
    };

    const handleCloseRefundDeal = () => {
        setOpen(false);
        setError(false);
    };

    const handleOpenDisputModal = () => {
        setOpenDisputModal(true);
    };

    const handleCloseDisputModal = () => {
        setOpenDisputModal(false);
        setError(false);
    };

    const handleToAccuseParty = (type) => {
        history.push(
            `/${type === 'user' ? 'accusing' : 'accused'}-party/${type}/${agreementName}/${type === 'user' ? userId : providerId}`,
            {userId, providerId, disputId}
        )
    };

    return (
        <div className={'buttons-group'}>
            <button
              disabled={accuseType === 'user'}
              onClick={() => handleToAccuseParty('user')}
              className={'transparent-border-button'}
            >
                Message to Accusing Party
                <img src={ArrowRightIcon} alt="Message to Accusing Party"/>
            </button>
            <button
              disabled={accuseType === 'provider'}
              onClick={() => handleToAccuseParty('provider')}
              className={'transparent-border-button'}
            >
                Message to Accused Party
                <img src={ArrowRightIcon} alt="Message to Accused Party"/>
            </button>
            <button
              disabled={disp !== 'PROCESSING'}
              className={`${disp === 'PROCESSING' ? 'red-button': 'transparent-border-button'}`} 
              onClick={handleOpenRefundDeal}>
                Refund Deal
                <img src={WalletIcon} alt=" Refund Deal" className={'wallet-icon'}/>
            </button>
            <button
              disabled={disp !== 'PROCESSING'}
              className={`${disp === 'PROCESSING' ? 'blue-button': 'transparent-border-button'}`}
              onClick={handleOpenDisputModal}>
              Close Dispute
              <img src={CloseIcon} alt="Close Dispute" className={'close-icon'}/>
            </button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleCloseRefundDeal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    {!error ?
                        <div className={'refund-deal-modal'}>
                            <img src={closedisput} className={'close-disput-icon'}/>
                            <div className={'refund-deal-title'}>
                                Refund Deal?
                            </div>
                            <p className={'refund-deal-desc'}>
                                By hitting "Continue" button you are insisting on returning Clients funds and
                                terminating disputed agreement.
                            </p>
                            <p className={'refund-deal-desc'} style={{marginTop: 10}}>
                                This action cannot be undone.
                            </p>
                            <div className={'modal-buttons-block'}>
                                <button className={'cancel-button'} onClick={handleCloseRefundDeal}>
                                    Cancel
                                    <img src={CancelModalIcon} alt="cancel modal"/>
                                </button>
                                <button className={'continue-button'} onClick={handleRefundDispute}>
                                    Continue
                                    <img src={ContinueModalIcon} alt="continue modal"/>
                                </button>
                            </div>
                        </div> :
                        <div className={'refund-deal-modal-error'}>
                            <div className={'error-title'}>Refund Failed</div>
                            <p className={'error-description'}>
                                Payment system or the server <br/>responded with error. Please try again later.
                            </p>
                            <div className={'modal-buttons-block'}>
                                <button className={'cancel-button'} onClick={handleRefundDispute}>
                                    Retry
                                    <img  src={RetryIcon} alt="cancel modal"/>
                                </button>
                                <button className={'continue-button'} onClick={handleCloseRefundDeal}>
                                    Close
                                    <img src={CancelModalWhiteIcon} alt="cancel modal"/>
                                </button>
                            </div>
                        </div>
                    }
                </Fade>
            </Modal>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openDisputModal}
                onClose={handleCloseDisputModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openDisputModal}>
                    {!error ?
                        <div className={'close-disput-modal'}>
                            <img src={closedisput} className={'close-disput-icon'}/>
                            <div>
                                <div className={'close-disput-title'}>
                                    Close Dispute?
                                </div>
                                <p className={'close-disput-desc'}>
                                    By hitting "Continue" button you are confirming that dispute was solved or irrelevant and the agreement can be proceed.
                                </p>
                            </div>
                            <div className={'modal-buttons-block'}>
                                <button className={'cancel-button'} onClick={handleCloseDisputModal}>
                                    Cancel
                                    <img src={CancelModalIcon} alt="cancel modal"/>
                                </button>
                                <button className={'continue-button'} onClick={handleCloseDispute}>
                                    Continue
                                    <img src={ContinueModalIcon} alt="continue modal"/>
                                </button>
                            </div>
                        </div> :
                      <div className={'close-disput-modal-error'}>
                        <div className={'error-title'}>Closing Dispute Failed</div>
                        <p className={'error-description'}>
                          Something went wrong. Please try again later.
                        </p>
                        <div className={'modal-buttons-block'}>
                          <button className={'cancel-button'} onClick={handleCloseDispute}>
                            Retry
                            <img  src={RetryIcon} alt="cancel modal"/>
                          </button>
                          <button className={'continue-button'} onClick={handleCloseDisputModal}>
                            Close
                            <img src={CancelModalWhiteIcon} alt="cancel modal"/>
                          </button>
                        </div>
                      </div>
                    }
                </Fade>
            </Modal>
        </div>
    );
};

export default memo(ButtonsGroup);
