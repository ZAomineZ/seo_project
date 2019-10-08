import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainWrapper from './MainWrapper';
import Layout from '../Layout/index';
import Legal from '../../components/legal';

import NotFound404 from '../DefaultPage/404/index';
import LogIn from '../Account/LogIn/index';
import LogInToken from '../../components/Auth/login_token';
import LogOut from '../../components/Auth/logout';
import Register from '../Account/Register/index';
import ConfirmationEmail from '../../components/Auth/email_confirmation';
import PassWordFagot from '../../components/Auth/password_forgot';
import PassWordFagotConfirm from '../../components/Auth/password_forgot_confirm';


import Landing from '../Landing/index';
import SerpSuggest from '../../components/Suggest/suggest_details';
import Suggest from '../../components/Suggest/suggest';
import SerpDetails from '../../components/Serp/index';
import SerpDateDetails from '../../components/Serp/serp_date';
import SerpIndex from '../../components/Serp/index_serp';
import SerpAnalyse from '../../components/Serp/serp_analyse';
import SerpAnalyseDetails from '../../components/Serp/serp_analyse_details';
import Crawl from '../../components/Crawl/crawl_index';
import CrawlDetails from '../../components/Crawl/crawl';
import SerpComparison from '../../components/Serp/serp_comparison';
import SerpComparisonDate from '../../components/Serp/serp_comparison_date';
import LinkProfile from '../../components/LinkProfile/index';
import LinkProfileDetails from '../../components/LinkProfile/linkprofile';
import Campain from '../../components/Campain/index';
import CampainDetails from '../../components/Campain/CampainDetails';
import KeywordDomains from '../../components/TopDomainsKeyword/index';
import TopKeywordIndex from '../../components/TopDomainsKeyword/top_index';
import RankToIndex from '../../components/RankTo/index';
import RankToIndexKeyword from '../../components/RankTo/indexKeyword';

const wrappedRoutes = () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <Route exact path="/seo/keyworddomains" component={TopKeywordIndex} />
      <Route exact path="/seo/keyworddomains/:keyword" component={KeywordDomains} />
      <Route exact path="/seo/campain/:web" component={CampainDetails} />
      <Route exact path="/seo/campain" component={Campain} />
      <Route exact path="/seo/linkprofile" component={LinkProfile} />
      <Route exact path="/seo/linkprofile/:domain" component={LinkProfileDetails} />
      <Route exact path="/seo/serp_comparison/:keyword" component={SerpComparison} />
      <Route exact path="/seo/serp_comparison/:keyword/:date" component={SerpComparisonDate} />
      <Route exact path="/seo/crawl" component={Crawl} />
      <Route exact path="/seo/crawl/:domain" component={CrawlDetails} />
      <Route exact path="/seo/suggest/:keyword" component={SerpSuggest} />
      <Route exact path="/seo/suggest" component={Suggest} />
      <Route exact path="/seo/serp_analyse" component={SerpAnalyse} />
      <Route exact path="/seo/serp_analyse/:domain" component={SerpAnalyseDetails} />
      <Route exact path="/seo/serp/:keyword" component={SerpDetails} />
      <Route exact path="/seo/serp/:keyword/:date" component={SerpDateDetails} />
      <Route exact path="/seo/serp" component={SerpIndex} />
      <Route exact path="/seo/rankTo" component={RankToIndex} />
      <Route exact path="/seo/rankTo/:project" component={RankToIndexKeyword} />
    </div>
  </div>
);

const Router = () => (
  <MainWrapper>
    <main>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/legal" component={Legal} />
        <Route exact path="/log_in" component={LogIn} />
        <Route exact path="/log_in/:token" component={LogInToken} />
        <Route exact path="/log_out" component={LogOut} />
        <Route path="/register" component={Register} />
        <Route path="/confirmation_email" component={ConfirmationEmail} />
        <Route path="/password_forgot" component={PassWordFagot} />
        <Route path="/password_forgot_confirm/:token" component={PassWordFagotConfirm} />
        <Route path="/seo" component={wrappedRoutes} />
        <Route exact path="*" component={NotFound404} /> {/* The Default not found component */}
      </Switch>
    </main>
  </MainWrapper>
);

export default Router;
