(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[59],{358:function(e,t,a){"use strict";a.r(t);var n=a(93),r=a(94),s=a(189),c=a(95),o=a(96),l=(a(307),a(0)),i=a.n(l),m=a(706),u=a(193),p=a.n(u),d=a(51),g=a(25),E=a(626),f=a.n(E),b=a(700),h=a.n(b),v=a(763),N=a.n(v),y=a(754),w=a.n(y),O=a(630),S=a(647),_=a(636),x=a(710),j=function(e){Object(c.a)(a,e);var t=Object(o.a)(a);function a(e){var r;return Object(n.a)(this,a),(r=t.call(this,e)).setStateFromInput=function(e){var t={};t[e.target.name]=e.target.value,r.setState(t)},r.socialSign=function(e){"google"===e?r.props.signInWithGoogle("user",r.props.history):r.props.signInWithFacebook("user",r.props.history)},r.createUser=function(e){if(e.preventDefault(),r.state.password!==r.state.repassword||r.state.password.length<7)return f.a.info("Confirm password!"),!1;var t={email:r.state.email,password:r.state.password,name:r.state.firstname+" "+r.state.surname,phone:r.state.phone};JSON.parse(sessionStorage.getItem("url"));r.props.signUp(t,r.props.history,"user"),r.props.addSIBContact(t,console.log,"user")},r.state={firstname:"",surname:"",name:"",email:"",password:"",repassword:"",phone:"",term_policy:""},r.setStateFromInput=r.setStateFromInput.bind(Object(s.a)(r)),r.createUser=r.createUser.bind(Object(s.a)(r)),r}return Object(r.a)(a,[{key:"componentDidMount",value:function(){var e=document.createElement("script");e.src="./assets/js/bundle-0c6e0e19e1.js",e.async=!0,document.body.appendChild(e)}},{key:"render",value:function(){var e=this;return i.a.createElement(l.Fragment,null,i.a.createElement("div",{className:"full-screen auth-page"},i.a.createElement("div",{className:"auth-content"},i.a.createElement(g.a,{to:"/"},i.a.createElement("img",{src:N.a,className:"auth-logo",alt:""})),i.a.createElement("div",{className:"login-content",style:{minHeight:"855px"}},i.a.createElement("div",{className:"login-header"},i.a.createElement(g.a,{to:"/sign-in"},i.a.createElement("h3",null,"User Sign In")),i.a.createElement("h3",{className:"selected"},"Sign Up")),i.a.createElement("div",{className:"login-body"},i.a.createElement("div",{className:"custom-container1"},i.a.createElement("form",{onSubmit:this.createUser},i.a.createElement("input",{type:"text",name:"firstname",className:"form-control login-input user-icon",placeholder:"First Name",onChange:this.setStateFromInput,required:!0}),i.a.createElement("input",{type:"text",name:"surname",className:"form-control login-input user-icon",placeholder:"Surname",onChange:this.setStateFromInput,required:!0}),i.a.createElement("input",{type:"email",name:"email",className:"form-control login-input email-icon",value:this.state.email,onChange:this.setStateFromInput,placeholder:"Email",required:!0}),i.a.createElement(p.a,{country:"us",onChange:function(t){return e.setState({phone:t})}}),i.a.createElement("input",{type:"password",name:"password",className:"form-control login-input lock-icon",placeholder:"Password",value:this.state.password,onChange:this.setStateFromInput,required:!0}),i.a.createElement("input",{type:"password",name:"repassword",onChange:this.setStateFromInput,className:"form-control login-input lock-icon",placeholder:"Confirm Password",required:!0}),i.a.createElement("div",{className:"custom-control custom-checkbox checkbox-outline checkbox-outline-primary sign-check"},i.a.createElement("input",{type:"checkbox",name:"term_policy",className:"custom-control-input",id:"tag9",onChange:this.setStateFromInput,required:!0}),i.a.createElement("label",{className:"custom-control-label sign-prity",htmlFor:"tag9"},"I agree to"," ",i.a.createElement("a",{href:"https://www.activities.app/terms-conditions",target:"_blank",rel:"noopener noreferrer",style:{textDecoration:"underline"}},"Terms of Use")," ","and"," ",i.a.createElement("a",{href:"https://www.activities.app/privacy-policy",target:"_blank",rel:"noopener noreferrer",style:{textDecoration:"underline"}},"Privacy Policy"))),i.a.createElement("div",{className:"normal-sign"},i.a.createElement("button",{type:"submit",className:"btn btn-sign"},"Sign Up"))),i.a.createElement("div",{className:"facebook-sign"},i.a.createElement("button",{className:"btn btn-facebook",onClick:function(){return e.socialSign()}},"Sign Up with facebook")),i.a.createElement("div",{className:"google-sign"},i.a.createElement("button",{className:"btn btn-google",onClick:function(){return e.socialSign("google")}},"Sign Up with Google")),i.a.createElement("div",{className:"line"}),i.a.createElement("div",null,i.a.createElement(g.a,{to:"/sign-up-advertiser"},i.a.createElement("h5",{className:"to-advertiser"},"Provider?"))))))),i.a.createElement("div",{className:"signup-back"},i.a.createElement(m.a,{placeholder:h.a,src:w.a,className:"auth-backimg",cache:!0,alt:""}))),i.a.createElement(x.a,null),i.a.createElement(_.a,null))}}]),a}(i.a.Component);t.default=Object(d.b)(function(e){return{logo:e.logo,users:e.users}},function(e){return{signInWithGoogle:function(t,a){return e(Object(O.i)(t,a))},signInWithFacebook:function(t,a){return e(Object(O.h)(t,a))},signUp:function(t,a,n){return e(Object(O.j)(t,a,n))},addSIBContact:function(t,a,n){return e(Object(S.a)(t,a,n))}}})(j)},634:function(e,t,a){e.exports=a.p+"static/media/app-store-badge-en-us.620bd2f5.svg"},635:function(e,t,a){e.exports=a.p+"static/media/google-play-badge-en-us.d462859f.svg"},636:function(e,t,a){"use strict";a.d(t,"a",function(){return E});var n=a(93),r=a(94),s=a(95),c=a(96),o=a(64),l=a(0),i=a.n(l),m=a(25),u=a(634),p=a.n(u),d=a(635),g=a.n(d),E=function(e){Object(s.a)(a,e);var t=Object(c.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){return i.a.createElement(l.Fragment,null,i.a.createElement("div",{className:"modal fade show",id:"modal-item-remove",tabIndex:"-1",role:"dialog",style:{display:"none",paddingRight:"17px"},"aria-modal":"true"},i.a.createElement("div",{className:"modal-dialog modal-dialog-centered",role:"document"},i.a.createElement("div",{className:"modal-content"},i.a.createElement("div",{className:"modal-body text-center p-top-40 p-bottom-50"},i.a.createElement("span",{className:"la la-exclamation-circle color-warning"}),i.a.createElement("h1",{className:"display-3 m-bottom-10"},"Are you sure?"),i.a.createElement("p",{className:"m-bottom-30"},"Do you really want to delete this item?"),i.a.createElement("div",{className:"d-flex justify-content-center"},i.a.createElement("button",{type:"button",className:"btn btn-secondary m-right-15","data-dismiss":"modal"},"Cancel"),i.a.createElement("button",{type:"button",className:"btn btn-danger"},"Yes, Delete it!")))))),i.a.createElement("footer",{id:"footer",className:"footer-three footer-grey p-top-95 "},i.a.createElement("div",{className:"footer-top p-bottom-25"},i.a.createElement("div",{className:"container"},i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"col-md-4 col-lg-4 col-sm-6"},i.a.createElement("div",{className:"widget widget_pages"},i.a.createElement("h2",{className:"widget-title"},i.a.createElement(o.b,{text:"explore"})),i.a.createElement("ul",{className:"list-unstyled"},i.a.createElement("li",{className:"page-item"},i.a.createElement(m.a,{to:"/about"},i.a.createElement(o.b,{text:"about_us"}))),i.a.createElement("li",{className:"page-item"},i.a.createElement(m.a,{to:"/faqs"},i.a.createElement(o.b,{text:"faq"}))),i.a.createElement("li",{className:"page-item"},i.a.createElement(m.a,{to:"/support"},i.a.createElement(o.b,{text:"support"}))),i.a.createElement("li",{className:"page-item"},i.a.createElement(m.a,{to:"/merchant-support"},i.a.createElement(o.b,{text:"provider_support"}))),i.a.createElement("li",{className:"page-item"},i.a.createElement(m.a,{to:"/new-providers-information"},i.a.createElement(o.b,{text:"provider_information"}))),i.a.createElement("li",{className:"page-item"},i.a.createElement(m.a,{to:"/privacy-policy"},i.a.createElement(o.b,{text:"privacy_policy"}))),i.a.createElement("li",{className:"page-item"},i.a.createElement(m.a,{to:"/terms-conditions"},i.a.createElement(o.b,{text:"terms_conditions"}))),i.a.createElement("li",{className:"page-item"},i.a.createElement(m.a,{to:"/provider-terms-conditions"},i.a.createElement(o.b,{text:"service_provider_terms"}))),i.a.createElement("li",{className:"page-item"},i.a.createElement(m.a,{to:"/all-listings-grid",onClick:function(e){return sessionStorage.removeItem("searchData")}},i.a.createElement(o.b,{text:"all_activities"}))),i.a.createElement("li",{className:"page-item"},i.a.createElement(m.a,{to:"/press"},i.a.createElement(o.b,{text:"press"})))))),i.a.createElement("div",{className:"col-md-4 col-lg-4 col-sm-6"},i.a.createElement("div",{className:"widget widget_social"},i.a.createElement("h2",{className:"widget-title"},"Connect with Us"),i.a.createElement("ul",{className:"list-unstyled social-list"},i.a.createElement("li",null,i.a.createElement("a",{href:"mailto:support@activities.app",target:"_blank",rel:"noopener noreferrer"},i.a.createElement("span",{className:"mail"},i.a.createElement("i",{className:"la la-envelope"}))," ","Contact Support")),i.a.createElement("li",null,i.a.createElement("a",{href:"https://twitter.com/Activities_App",target:"_blank",rel:"noopener noreferrer"},i.a.createElement("span",{className:"twitter"},i.a.createElement("i",{className:"fab fa-twitter"}))," ","Twitter")),i.a.createElement("li",null,i.a.createElement("a",{href:"https://www.facebook.com/Activities-App-103000531321891",target:"_blank",rel:"noopener noreferrer"},i.a.createElement("span",{className:"facebook"},i.a.createElement("i",{className:"fab fa-facebook-f"}))," ","Facebook")),i.a.createElement("li",null,i.a.createElement("a",{href:"https://www.instagram.com/activities_app/",target:"_blank",rel:"noopener noreferrer"},i.a.createElement("span",{className:"instagram"},i.a.createElement("i",{className:"fab fa-instagram"}))," ","Instagram"))))),i.a.createElement("div",{className:"col-md-4 col-lg-4 col-sm-6"},i.a.createElement("div",{className:"widget widget_text"},i.a.createElement("h2",{className:"widget-title"},i.a.createElement(o.b,{text:"activities_on_mobile"})),i.a.createElement("div",{className:"textwidget"},i.a.createElement("p",null,i.a.createElement(o.b,{text:"footer_download_app"})),i.a.createElement("ul",{className:"list-unstyled store-btns"},i.a.createElement("li",{className:"padding-5"},i.a.createElement("a",{target:"_blank",href:"https://apps.apple.com/app/id1501612336#?platform=iphone",rel:"noopener noreferrer"},i.a.createElement("img",{src:p.a,width:"150",alt:"",className:"applebtn"}))),i.a.createElement("li",{className:"padding-5"},i.a.createElement("a",{target:"_blank",href:"https://play.google.com/store/apps/details?id=app.activities.activities ",rel:"noopener noreferrer",style:{borderRadius:"30px"}},i.a.createElement("img",{src:g.a,alt:"",width:"145",className:"googlebtn"})))))))))),i.a.createElement("div",{className:"footer-bottom"},i.a.createElement("div",{className:"container"},i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"col-lg-12"},i.a.createElement("div",{className:"footer-bottom--content"},i.a.createElement(m.a,{to:"/",className:"footer-logo"},i.a.createElement("img",{src:"./assets/img/logo.jpg",alt:""})),i.a.createElement("p",{className:"m-0 copy-text"}," ","\xa92021 ",i.a.createElement(o.b,{text:"activities"})),i.a.createElement("ul",{className:"list-unstyled lng-list"}))))))))}}]),a}(l.Component)},700:function(e,t,a){e.exports=a.p+"static/media/loading.2e66f7f1.gif"},706:function(e,t,a){"use strict";var n=a(0),r=a.n(n);function s(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function c(){return(c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}var o="REACT_COOL_IMG",l=function(){function e(){s(this,"img",null),s(this,"timeout",null),s(this,"retries",1)}var t=e.prototype;return t.load=function(e,t,a,n,r,s){var c=this,o=a.count,l=void 0===o?3:o,i=a.delay,m=void 0===i?2:i,u=a.acc,p=void 0===u?"*":u;this.img=new Image,this.img.src=e,s&&(this.img.crossOrigin=s),t&&this.img.decode&&this.img.decode().catch(function(){}),this.img.onerror=function(t){if(!l||c.retries>l)n(t);else{var a="*"===p?Math.pow(m,c.retries):m*c.retries;!1===p&&(a=m),c.timeout=setTimeout(function(){c.clearImgSrc(),c.img.src=e},1e3*a),c.retries+=1}},this.img.onload=function(e){r(e)}},t.unload=function(){this.img&&(this.img.onerror=null,this.img.onload=null,this.clearImgSrc(),this.img=null),this.timeout&&(clearTimeout(this.timeout),this.timeout=null),this.retries=1},t.clearImgSrc=function(){this.img.src="";try{delete this.img.src}catch(e){}},e}(),i=Object(n.forwardRef)(function(e,t){var a=e.className,s=void 0===a?"":a,i=e.placeholder,m=e.src,u=e.error,p=e.crossOrigin,d=e.decode,g=void 0===d||d,E=e.lazy,f=void 0===E||E,b=e.cache,h=void 0===b||b,v=e.debounce,N=void 0===v?300:v,y=e.observerOptions,w=void 0===y?{}:y,O=e.retry,S=void 0===O?{}:O,_=e.srcSet,x=e.sizes,j=e.onError,A=e.onLoad,I=function(e,t){if(null==e)return{};var a,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,["className","placeholder","src","error","crossOrigin","decode","lazy","cache","debounce","observerOptions","retry","srcSet","sizes","onError","onLoad"]),k=Object(n.useRef)(new l),C=function(e,t){var a=t.root,r=t.rootMargin,s=void 0===r?"50px":r,c=t.threshold,o=void 0===c?.01:c,l=Object(n.useState)(!1),i=l[0],m=l[1],u=Object(n.useState)(null),p=u[0],d=u[1],g=Object(n.useRef)(null),E=Object(n.useRef)(null),f=Object(n.useRef)(!1),b=o;"number"!==typeof o&&(console.warn("\ud83d\udca1react-cool-img: the threshold of observerOptions must be a number. Use 0 as fallback."),b=0);var h=Object(n.useCallback)(function(){E.current&&(clearTimeout(E.current),E.current=null)},[]);return Object(n.useEffect)(function(){if(!("IntersectionObserver"in window)||!("IntersectionObserverEntry"in window))return f.current||(console.error("\ud83d\udca1react-cool-img: the browser doesn't support Intersection Observer, please install polyfill to enable lazy loading: https://github.com/wellyshen/react-cool-img#intersection-observer-polyfill"),f.current=!0),m(!0),function(){return null};g.current=new IntersectionObserver(function(t){var a=t[0],n=a.isIntersecting,r=a.intersectionRatio;(void 0!==n?n:r>0)&&!i?E.current=setTimeout(function(){m(!0)},e):h()},{root:a,rootMargin:s,threshold:b});var t=g.current;return p&&t.observe(p),function(){t.disconnect(),h()}},[p,i,a,s,b,e,h]),[d,i]}(N,w),F=C[0],U=C[1],D=Object(n.useState)(i||"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="),R=D[0],L=D[1],q=R===m,P=m?m.replace(/^.*[\\/]/,"").split(".")[0]:"",z=function(e){j&&j(e),u?L(u):i&&L(i)},B=function(e){A&&A(e),L(m),h&&function(e){try{var t=JSON.parse(sessionStorage.getItem(o)||"{}");t[e]=new Date,sessionStorage.setItem(o,JSON.stringify(t))}catch(u){console.error("\ud83d\udca1 react-cool-img: "+u)}}(m)};return Object(n.useEffect)(function(){var e=k.current,t=function(){e.load(m,g,S,z,B,p)};return!f||h&&function(e){try{return!!JSON.parse(sessionStorage.getItem(o)||"{}")[e]}catch(u){return console.error("\ud83d\udca1 react-cool-img: "+u),!1}}(m)?t():U&&t(),function(){e.unload()}},[h,U,m,p,g,S]),r.a.createElement(r.a.Fragment,null,r.a.createElement("img",c({className:s+" no-js-"+P,src:R,crossOrigin:q?p:void 0,srcSet:q?_:void 0,sizes:q?x:void 0},I,{ref:function(e){e&&(F(e),t&&(t.current=e))}})),r.a.createElement("noscript",null,r.a.createElement("style",null,".no-js-"+P+" { display: none !important; }"),r.a.createElement("img",c({className:s,src:m,crossOrigin:p,srcSet:_,sizes:x},I))))}),m=Object(n.memo)(i);t.a=m},710:function(e,t,a){"use strict";a.d(t,"a",function(){return o});var n=a(0),r=a.n(n),s=a(64),c=a(81);function o(){var e=Object(c.a)().t;return r.a.createElement("section",{className:"subscribe-wrapper"},r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-md-8 offset-md-2"},r.a.createElement("h1",null,r.a.createElement(s.b,{text:"subscribe_title"})),r.a.createElement("p",null,r.a.createElement(s.b,{text:"subscribe_desc1"})),r.a.createElement("form",{action:"/",className:"subscribe-form m-top-40"},r.a.createElement("div",{className:"form-group"},r.a.createElement("span",{className:"la la-envelope-o"}),r.a.createElement("input",{type:"text",placeholder:"".concat(e("subscribe_desc2")),required:!0})),r.a.createElement("button",{className:"btn btn-gradient btn-gradient-one"},r.a.createElement(s.b,{text:"subscribe_desc3"})))))))}},754:function(e,t,a){e.exports=a.p+"static/media/sign-page.54374e3f.jpg"},763:function(e,t,a){e.exports=a.p+"static/media/logo@2.a66a5b37.png"}}]);