function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}
function id(obj) {
    return document.getElementById(obj);
}
// 对obj进行监听事件
function observe(obj, e, fn) { 
    if (obj.addEventListener) {
        obj.addEventListener(e, fn, false);
    } else {
        obj.attachEvent('on' + e, function() {
            fn.call(obj);
        });
    }
}
// 添加类
function addClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0, len = aClass.length; i < len; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}
// 移除类
function removeClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0, len = aClass.length; i < len; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}
// 初始化加载起始页
function fnLoad() {
	var oTime = new Date().getTime();
	var oWelcome = id('welcome');
	var oTimer;
	observe(oWelcome, 'WebkitTransitionEnd', end);
	observe(oWelcome, 'transitionend', end);
	oTimer = setInterval(function() {
		if ((new Date().getTime() - oTime) >= 4000) {
			clearInterval(oTimer);
			oWelcome.style.opacity = 0;
		}
	}, 1000);
	function end() {
		removeClass(oWelcome,"pageShow");
		fnTab();
	}
}
// 首页
function fnTab() {
	var oTab=id("tabPic");
	var oList=id("picList");
	var aNav=oTab.getElementsByTagName("nav")[0].children;
	var iNow=0;
	var iX=0;
	var iW=view().w;
	var oTimer;
	var iStartTouchX=0;
	var iStartX=0;
	observe(oTab,"touchstart",fnStart);
	observe(oTab,"touchmove",fnMove);
	observe(oTab,"touchend",fnEnd);
	auto();
	if(!window.BfnScore) {
		fnScore();
		window.BfnScore=true;
	}
	function auto() {
		oTimer=setInterval(function(){
			iNow++;	
			iNow=iNow%aNav.length;
			tab();
		},2000);
	}
	function fnStart(e) {
		oList.style.transition="none";
		e=e.changedTouches[0];
		iStartTouchX=e.pageX;
		iStartX=iX;
		clearInterval(oTimer);
	}
	function fnMove(e) {
		e=e.changedTouches[0];
		var iDis=e.pageX-iStartTouchX;
		iX=iStartX+iDis;
		oList.style.WebkitTransform=oList.style.transform="translateX("+iX+"px)";
	}
	function fnEnd() {
		iNow=iX/iW;
		iNow=-Math.round(iNow);
		if(iNow<0) {
			iNow=0;
		}
		if(iNow>aNav.length-1) {
			iNow=aNav.length-1;
		}
		tab();
		auto();
	}
	function tab() {
		iX=-iNow*iW;
		oList.style.transition="0.5s";
		oList.style.WebkitTransform=oList.style.transform="translateX("+iX+"px)";
		for(var i=0, len=aNav.length;i<len;i++) {
			removeClass(aNav[i],"active");
		}
		addClass(aNav[iNow],"active");
	}
}
function fnScore() {
	var oScore=id("score");
	var aLi=oScore.getElementsByTagName("li");
	var arr=["好失望","没有想象的那么差","很一般","良好","棒极了"];
	for(var i=0,len=aLi.length;i<len;i++) {
		fn(aLi[i]);
	}
	function fn(oLi) {
		var aNav=oLi.getElementsByTagName("a");
		var oInput=oLi.getElementsByTagName("input")[0];
		for(var i=0;i<aNav.length;i++) {
			aNav[i].index=i;
			observe(aNav[i],"touchstart",function(){
				for(var j=0;j<aNav.length;j++) {
					if(j<=this.index){
						addClass(aNav[j],"active");
					} else {
						removeClass(aNav[j],"active");
					}
				}
				oInput.value=arr[this.index]; // hide的input写入value值,给后边做判断使用
			});
		}
	}
	fnIndex();
}
// 底部提交按钮,和p标签内容
function fnIndex() {
	var oIndex=id("index");
	var oBtn=oIndex.getElementsByClassName("btn")[0];
	var oInfo=oIndex.getElementsByClassName("info")[0];
	var bScore=false;
	observe(oBtn,"touchend",fnEnd);
	function fnEnd() {
		bScore=fnScoreChecked(); // 景区评分
		if(bScore) { // 景区评分存在
			if(bTag()) { // 景区标签选中
				fnIndexOut(); // 	
			} else {
				fnInfo(oInfo,"给景区添加标签"); // 景区标签没选中,提示给景区添加标签
			}
		} else {
			fnInfo(oInfo,"给景区评分"); // 没有对景区评分,提示对景区评分
		}
	}
	// 给景区评分, 检测是否有评分
	function fnScoreChecked() {
		var oScore=id("score");
		var aInput=oScore.getElementsByTagName("input");
		for(var i=0;i<aInput.length;i++) {
			if(aInput[i].value==0) { // 通过检测value值,判断是否评分
				return false;
			}
		}
		return true;
	}
	// 给景区添加标签, 判断标签是否选中
	function bTag() {
		var oTag=id("indexTag");
		var aInput=oTag.getElementsByTagName("input");
		for(var i=0;i<aInput.length;i++) {
			if(aInput[i].checked) {
				return true;
			}
		}
		return false;
	}
}
// (提示作用)景区添加标签和景区评分不存在时,提示用户做相应的处理
function fnInfo(oInfo,sInfo) {
	oInfo.innerHTML=sInfo;
	oInfo.style.WebkitTransform="scale(1)";
	oInfo.style.opacity=1;
	setTimeout(function() {
		oInfo.style.WebkitTransform="scale(0)";
		oInfo.style.opacity=0;
	},1000);
}
// 
function fnIndexOut() {
	var oMask=id("mask");
	var oIndex=id("index");
	var oNew=id("news");
	addClass(oMask,"pageShow"); // 显示遮罩
	addClass(oNew,"pageShow"); // 显示上传文件部分
	fnNews(); // 判断上传的文件是video还是image
	setTimeout(function() {
		oMask.style.opacity=1;	
		oIndex.style.WebkitFilter=oIndex.style.filter="blur(5px)"; // 给首页整个内容部分设置模糊5px
	},14);
	setTimeout(function() {
		oNew.style.transition="0.5s";
		oMask.style.opacity=0;	
		oIndex.style.WebkitFilter=oIndex.style.filter="blur(0px)"; 
		oNew.style.opacity=1;
		removeClass(oMask,"pageShow");
	},3000);
}
// 判断上传的文件是video还是image
function fnNews() {
	var oNews=id("news");
	var oInfo=oNews.getElementsByClassName("info")[0];
	var aInput=oNews.getElementsByTagName("input");
	aInput[0].onchange=function() {
		if(this.files[0].type.split("/")[0]=="video") {
			fnNewsOut(); // 显示给视频添加标签
			this.value="";
		} else {
			fnInfo(oInfo,"请上传视频");
		}
	};
	aInput[1].onchange=function() {
		if(this.files[0].type.split("/")[0]=="image") {
			fnNewsOut(); // 显示给视频添加标签
			this.value="";
		} else {
			fnInfo(oInfo,"请上传图片");
		}
	};
}
// 显示form给视频添加标签
function fnNewsOut() {
	var oNews=id("news");
	var oForm=id("form");
	addClass(oForm,"pageShow");
	oNews.style.cssText=""; // cssText会清除之前元素含有的样式
	removeClass(oNews,"pageShow");
	formIn();
}
// 显示添加视频标签页
function formIn() {
	var oForm=id("form");
	var oOver=id("over");
	var aFormTag=id("formTag").getElementsByTagName("label");
	var oBtn=oForm.getElementsByClassName("btn")[0];
	var bOff=false;
	for(var i=0;i<aFormTag.length;i++) {
		observe(aFormTag[i],"touchend",function() {
			bOff=true;
			addClass(oBtn,"submit"); // 给弹出的新的按钮设置样式
		});
	}
	observe(oBtn,"touchend",function(){
		if(bOff) {
			for(var i=0;i<aFormTag.length;i++) {
				aFormTag[i].getElementsByTagName("input")[0].checked=false;
			}
			bOff=false;
			addClass(oOver,"pageShow"); // 显示初始化的页,并提示上传成功
			removeClass(oForm,"pageShow"); // 隐藏显示的上传视频标签页
			removeClass(oBtn,"submit"); // 隐藏显示的上传视频标签页上的提交按钮
			over(); // 隐藏显示的结束页
		}
	});
}
// 隐藏显示的结束页
function over() {
	var oOver=id("over");
	var oBtn=oOver.getElementsByClassName("btn")[0];
	observe(oBtn,"touchend",function() {
		removeClass(oOver,"pageShow");
	});
}