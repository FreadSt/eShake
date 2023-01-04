import React, {Component} from 'react';
import TickIcon from '../../assets/messages/tick.svg';
import WarnIcon from '../../assets/agreement/warn-icon.svg';
import moment from 'moment';
import './styles.scss';
import AttachedFile from "../../components/attachedFileComponent";

class MilestoneCard extends Component {

    handleRenderMilestoneFiles = () => {
      const {milestone} = this.props;
      if (milestone && milestone.milestoneFiles.length > 0) {
          return milestone.milestoneFiles.map((item) => {
              return(
                <div className={'milestone-description-block'}>
                  <AttachedFile file={item} key={item._id}/>
                </div>
              )
          })
      }
    }
    
    handleRenderFinishComment = () => {
      const {milestone} = this.props;
      if (milestone && milestone.finishComment) {
        return(
          <p className={'desc'}>{milestone.finishComment}</p>
        )
      }
    }
    
    handleRenderMilestoneState = () => {
      const {milestone, agreementState} = this.props;
      if (milestone.state === 'paid_out') {
        return (
          <div className={'status-block'}>
            <img src={TickIcon} alt="payed"/>
            Payed
          </div>
        )
      } else if (milestone.state === 'in_progress' && agreementState === 'frozen') {
        return (
          <div className={'status-block'} style={{color: '#FD6764'}}>
            <img src={WarnIcon} alt="Disputed"/>
            Disputed
          </div>
        )
      } else {
        return (
          <div className={'status-block'} style={{color: '#161721', opacity: 0.5}}>
            <i className="far fa-calendar-alt" style={{marginRight: 5}}/>
            {moment(milestone.endDate).format('DD.MM.YYYY')}
          </div>
        )
      }
    }

    render() {
        const {milestone} = this.props;
        return (
            <div className={'milestone-card'} style={{opacity: milestone.state === 'paid_out' ? 0.8 : 1}}>
                <div className={'milestone-title-block'}>
                    <h4 className={'milestone-title'}>{milestone.name}</h4>
                    {this.handleRenderMilestoneState()}
                </div>
                <div className={'milestone-description-block'}>
                    <p className={'desc'}>{milestone.description}</p>
                    <span className={'cost'}>{milestone.cost}</span>
                </div>
                  {this.handleRenderMilestoneFiles()}
                <div style={{
                  display: 'block',
                  overflowWrap: 'break-word',
                  hyphens: 'manual'
                }}>
                  {this.handleRenderFinishComment()}
                </div>
            </div>
        );
    }
}

export default MilestoneCard;
