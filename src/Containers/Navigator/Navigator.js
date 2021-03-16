import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Dashboard from "../Dashboard/dashboard";
import FileUpload from "../../Components/FileUpload/FileUpload";
import BuyCredits from "../BuyCredits/BuyCredits";
import Services from "../PkgServices/PkgServices";
import Campaign from "../Campaign/Campaign";
import SenderIds from "../SenderIds/SenderIds";
import LeadDetail from "../LeadDetail/LeadDetail";
import LeadManagement from "../LeadManagement/LeadManagement";
import LeadStatus from "../../Components/LeadManagement/LeadStatus/LeadStatus";
import LeadBucket from "../../Components/LeadManagement/LeadBucket/LeadBucket";
import LeadFunnel from "../../Components/LeadManagement/LeadFunnel";
import LeadStatusMapping from "../../Components/LeadManagement/LeadsMapping/LeadStatusMapping";
import PublisherMapping from "../../Components/LeadManagement/PublisherMapping/PublisherMapping";
import LeadTypeAssign from "../../Components/LeadManagement/LeadTypeAssign";
import StatusGroup from "../../Components/LeadManagement/StatusGroup/StatusGroup";
import StatusMapping from "../../Components/LeadManagement/StatusGroup/StatusMapping";
import RolesV1 from "../../Containers/Roles/RolesV1";
import ServicePackages from "../Subscriptions/ServicePackages";
import ManageSubscriptions from "../Subscriptions/ManageSubscription";
//import EditPackage from '../../Components/ServicePackage/EditPackage';
import Mediums from "../Mediums/Mediums";
import LeadTable from "../../Components/Lead/LeadTable";
import LeadReportUpload from "../LeadReportUpload/LeadReportUpload";
import Leads from "../Leads/Leads";
import Datasource from "../Datasource/Datasource";
import Segments from "../Segments/Segments";
import Transactions from "../Transactions/Transaction";
import Task from "../Task/Task";
import DatasourceMapSegment from "../../Components/Datasource/DatasourceMappedSegments";
import SegmentGroup from "../SegmentGroup/SegmentGroup";
import MappedSegmentGroup from "../../Components/Segments/MappedSegmentGroup";
import AddClients from "../../Components/Datasource/AddClients";
import MappedDatasource from "../../Components/MappedDatasource/MappedDatasource";
import Templates from "../Templates/Templates";
import ViewCampaign from "../../Components/Campaign/ViewCampaign";
import ViewCampaignPopup from "../../Components/Campaign/ViewCampaignPopup";
import LandingPages from "../LandingPages/LandingPages";
import CreateNewCampaign from "../../Components/Campaign/CreateNewCampaign";
import RetargettingSMSPro from "../../Components/Campaign/JourneyDesigner/JourneyDesigner";
import ProfileV1 from "../../Containers/Profile/ProfileV1";
import Clients from "../Clients/Clients";
import IVR from "../../Containers/IVR/IVR";
import LeadReports from "../LeadReports/LeadReports";
import LeadPush from "../LeadManagement/LeadPush";
import SMSReports from "../../Components/Campaign/SMSReports/SMSReports";
import CreateCampaign from "../../Containers/Campaign/CreateCampaign";
//import EmployeeFrom from '../EmployeeForm/EmployeeForm';
//import RetypePassword from "../LoginSignup/RetypePassword";

function Navigator({ location, history, userType, userInfo }) {
  return (
    <TransitionGroup className="container-new bg-light">
      <CSSTransition
        key={location.key}
        timeout={{ enter: 300, exit: 300 }}
        classNames={"fade"}
      >
        <Switch location={location}>
          <Route exact path="/home">
            <Dashboard
              userType={userType}
              userInfo={userInfo}
              history={history}
            />
          </Route>
          <Route path="/campaigns">
            <Campaign history={history} />
          </Route>
          <Route exact path="/autocampaigns">
            <CreateCampaign userType={userType} history={history} />
          </Route>
          <Route path="/buycredits">
            <BuyCredits userType={userType} location={location} />
          </Route>
          <Route exact path="/leads">
            <LeadTable history={history} />
          </Route>
          <Route exact path="/leads/details">
            <LeadDetail history={history} />
          </Route>
          <Route path="/leads/management">
            <LeadManagement />
          </Route>
          <Route exact path="/leads/status">
            <LeadStatus />
          </Route>
          <Route path="/leads/bucket">
            <LeadBucket />
          </Route>
          <Route path="/leads/funnel">
            <LeadFunnel />
          </Route>
          <Route path="/leads/mapping">
            <LeadStatusMapping />
          </Route>
          <Route exact path="/leads/status/group/name/mapping">
            <StatusMapping />
          </Route>
          <Route path="/leads/status/group/name">
            <StatusGroup />
          </Route>
          <Route path="/leads/summary">
            <Leads history={history} />
          </Route>
          <Route path="/leads/assignLead">
            <LeadTable history={history} leadAssign="leadAssign" />
          </Route>
          <Route path="/leads/leadtype/mapping">
            <LeadTypeAssign />
          </Route>
          <Route path="/leads/publisher">
            <PublisherMapping />
          </Route>
          <Route path="/leads/upload/report">
            <LeadReportUpload />
          </Route>
          <Route path="/profile">
            <ProfileV1 />
          </Route>
          <Route path="/sender-ids">
            <SenderIds />
          </Route>
          <Route path="/transactions">
            <Transactions />
          </Route>
          <Route path="/upload">
            <FileUpload />
          </Route>
          <Route path="/landing-pages">
            <LandingPages />
          </Route>
          <Route path="/mediums">
            <Mediums history={history} />
          </Route>
          <Route path="/medium/mapped-datasource">
            <MappedDatasource />
          </Route>
          <Route path="/services/all">
            <Services userType={userType} />
          </Route>
          <Route path="/datasource">
            <Datasource history={history} userType={userType} />
          </Route>
          <Route path="/mapped-clients">
            <AddClients title="Mapped" />
          </Route>
          <Route path="/blocked-clients">
            <AddClients title="Blocked" />
          </Route>
          <Route path="/segments">
            <Segments />
          </Route>
          <Route path="/mapped-segments">
            <DatasourceMapSegment />
          </Route>
          <Route path="/segment-group">
            <SegmentGroup history={history} userType={userType} />
          </Route>
          <Route path="/mapped-segment-group">
            <MappedSegmentGroup />
          </Route>
          <Route path="/templates">
            <Templates />
          </Route>
          <Route path="/tasks">
            <Task history={history} />
          </Route>
          <Route exact path="/view-campaign">
            <ViewCampaign location={location} />
          </Route>
          <Route path="/view-campaign/clickShortURL">
            <ViewCampaignPopup history={history} />
          </Route>
          <Route path="/update-stats-campaign">
            <ViewCampaign location={location} />
          </Route>
          <Route path="/campaign-create">
            <CreateNewCampaign location={location} history={history} />
          </Route>
          <Route path="/edit-campaign">
            <CreateNewCampaign location={location} history={history} />
          </Route>
          <Route path="/clone-campaign">
            <CreateNewCampaign location={location} history={history} />
          </Route>
          <Route path="/campaign/journey/designer">
            <RetargettingSMSPro />
          </Route>
          <Route path="/campaign/report">
            <SMSReports />
          </Route>
          <Route path="/manage/subscriptions">
            <ManageSubscriptions />
          </Route>
          <Route path="/roles/manage">
            <RolesV1 />
          </Route>
          <Route path="/service/package">
            <ServicePackages
              showHeading="true"
              history={history}
              userType={userType}
            />
          </Route>
          {/* <Route path='/service/package/edit'>
                        <EditPackage assign="true"/>
                    </Route>                     */}
          <Route path="/test">
            <ProfileV1 />
          </Route>
          <Route path="/clients">
            <Clients location={location} />
          </Route>
          <Route path="/agency">
            <Clients location={location} />
          </Route>
          <Route path="/ivr-panel">
            <IVR />
          </Route>
          <Route path="/leads/reports">
            <LeadReports history={history} />
          </Route>
          <Route path="/leads/push">
            <LeadPush />
          </Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default withRouter(Navigator);
