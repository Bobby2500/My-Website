const gridPixelSize = 60;
const background = document.getElementById("bg");
const wrapper = document.getElementById("tiles");
const title = document.getElementById("title");
const circleText = document.getElementsByClassName("circle_text")
var isLandingPageClicked = false;
let cols ,rows ;

const handleOnClick = index => {
    if (isLandingPageClicked) return
    isLandingPageClicked = true;
    var blinker;
    let header = document.getElementsByTagName("header")[0]
    let main = document.getElementById("main_page")
    let mainNav = document.getElementById("main_nav_container")
    mainNav.style.setProperty("--nav-height", `${mainNav.clientHeight}px`)
    
    anime({
        targets: ".tile",
        scale: [
            {value: 1, easing: 'easeOutSine', duration: 0},   
            {value: 0, easing: 'easeOutSine', duration: 500}
        ],
        delay: anime.stagger(100, {grid: [cols, rows], from: index}),
        begin: () => {
            header.style.setProperty("--op", 0);
            main.style.setProperty("--op-welcome", 0);
            main.style.setProperty("--op-website", 0);
            main.style.setProperty("--op-flasher", 0);
            main.style.setProperty("--op-nav", 0);
            background.classList.add("fade");
            title.classList.add("fade");
        },
        complete: () => {
            background.remove();
            wrapper.remove();
            title.remove();
            
            anime({
                targets: '#welcome',
                width: [0,"8ch"],
                duration: 800,
                easing: 'steps(8)',
                begin: () => {
                    main.style.setProperty("--op-welcome", 1);
                    
                    let blinkerObj = document.createElement("div")
                    blinkerObj.classList.add("main_blinker")
                    
                    let blinkerTarget = main.getElementsByClassName("typing")[0]
                    blinkerTarget.appendChild(blinkerObj)
                    
                    blinker = document.getElementsByClassName("main_blinker")[0]
                },
                complete: () => {
                    blinker.remove();
                    
                    anime({
                        targets: '#website',
                        width: [0,"13ch"],
                        duration: 1300,
                        easing: 'steps(13)',
                        begin: () => {
                            main.style.setProperty("--op-website", 1);
                            
                            let blinkerObj = document.createElement("div")
                            blinkerObj.classList.add("main_blinker")
                            
                            let blinkerTarget = main.getElementsByClassName("typing")[1]
                            blinkerTarget.appendChild(blinkerObj)
                        },
                        complete: () => {

                            header.style.setProperty("--op", 1);
                            header.classList.add("border_toggle")
                            
                            anime({
                                targets: "#logo path",
                                strokeDashoffset: [anime.setDashoffset, 0],
                                easing: 'easeInOutSine',
                                delay: 1000,
                                duration: 2000,
                                direction: 'alternate',
                                loop: false
                            });
                            
                            anime({
                                targets: "nav > div:nth-child(n+2) > a",
                                easing: 'easeInOutSine',
                                opacity: [0, 1],
                                delay: 1000,
                                duration: 2000,
                                complete: () => {
                                    anime({
                                        targets: "#main_nav_container span",
                                        keyframes: [
                                            {opacity: [0,1]},
                                            {translateY: "-100%"},
                                            {rotate: anime.stagger([0, 360])}
                                        ],
                                        duration: 500,
                                        delay:  anime.stagger(50, {direction: 'reverse'}),
                                        easing: "easeInOutSine",
                                        begin: () => {
                                            main.style.setProperty("--op-nav", 1);
                                        },
                                        complete: () => {
                                            anime({
                                                targets: "#main_nav_container .circle_text",
                                                rotate: [0,360],
                                                loop: true,
                                                duration: 25000,
                                                easing: "linear"
                                            })
                                        }
                                    })
                                }
                            });
                            
                            anime ({
                                targets: "#flasher > div:first-child",
                                left: ["50%", 0],
                                right: ["50%", 0],
                                duration: 1000,
                                easing: "easeOutInElastic(1, .6)",
                                complete: () => {

                                    main.style.setProperty("--op-flasher", 1);

                                    anime ({
                                        targets: "#flasher > div:first-child",
                                        left: [0, "50%"],
                                        right: [0, "50%"],
                                        delay: 200,
                                        duration: 200,
                                        easing: "linear"
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    });
}

const handleTitleOnClick = () => {
    
    let centerCol = Math.floor(cols/2); 
    let centerRow = Math.floor(rows/2);
    
    handleOnClick(((centerRow - 1) * cols) + centerCol);
}

const createTile = index => {
    const tile = document.createElement("div");

    tile.classList.add("tile");
    
    tile.onclick = e => handleOnClick(index);
    
    return tile;
}

const createTiles = num => {
    Array.from(Array(num)).map((temp, index) => {
        wrapper.appendChild(createTile(index));
    })
    
    anime({
        targets: ".tile",
        borderRadius: ["2px", "4.2px"],
        direction: "alternate",
        loop: true,
        duration: 3000,
        delay: 500,
        endDelay: 500,
        easing: "easeInOutSine"
    });

}


const createGrid = () => {
    wrapper.innerHTML = "";
    
    cols = Math.floor(document.body.clientWidth/gridPixelSize);
    rows = Math.floor(document.body.clientHeight/gridPixelSize);
    fadeTiming = 100 * (Math.max(cols,rows)*0.55);

    wrapper.style.setProperty("--cols", cols);
    wrapper.style.setProperty("--rows", rows);
    background.style.setProperty("--time", `${fadeTiming}ms`);
    title.style.setProperty("--time", `${fadeTiming}ms`);
    
    createTiles (cols * rows);
}

for (let obj of circleText) {
    obj.innerHTML = obj.innerText.split("").map(
        (char, i) => {
            if (i == 0) {
                return `<span> </span><span>${char}</span>`
            } 
            return `<span>${char}</span>`
        }
    ).join("")
}

createGrid();
title.onclick = e => handleTitleOnClick();


//header

const collapsible = document.getElementById("collapsible")
const navbar = [document.getElementById("nav_link"), document.getElementById("nav_feedback"), document.getElementById("nav_social")]
var toggle = false

const toggleNavbar = transY => {
    for (let index in navbar) {
        navbar[index].style.setProperty("--transY", `${transY}vh`);
    }
}

collapsible.style.setProperty("--deg", "0deg");
toggleNavbar(-100);

collapsible.onclick = e => {
    toggle = !toggle;
    if(toggle) {
        collapsible.style.setProperty("--deg", "135deg");
        toggleNavbar(0);
    } else {
        collapsible.style.setProperty("--deg", "0deg");
        toggleNavbar(-100);
    }
}

//Main
const main = document.getElementsByTagName("main")[0];
main.style.setProperty("--header-height", `${document.getElementsByTagName("header")[0].clientHeight}px`);

const changeToMain = [document.getElementById("select_main"), document.getElementById("project_nav_container")]
const changeToAbout = [document.getElementById("select_about"), document.getElementById("main_nav_container")]
const changeToTimeline = [document.getElementById("select_timeline"), document.getElementById("about_nav_container")]
const changeToProject = [document.getElementById("select_project"), document.getElementById("timeline_nav_container")]
const about = document.getElementById("about_page")
const aboutText = document.getElementById("about_text")
const timeline = document.getElementById("timeline_page")
const timelineText = document.getElementById("timeline_text")
const timelineEventsText = document.getElementById("timeline_line").innerText
const timelineTextSlides = timelineText.innerHTML.replace(/(\r\n|\n|\r)/gm, "").split(";")
const project = document.getElementById("project_page")
const projectContent = document.getElementById("project_content").innerHTML.replace(/\s\s+/g, " ").split(";")
const projectExpandedCover = document.getElementById("project_expanded_cover")
const aboutFillText = aboutText.innerText
var currentPage = 1,
    isAboutLoaded = false,
    isTimelineLoaded = false,
    isProjectLoaded = false;
var startOffset = 0,
    exitOffset = 0,
    timelineIndex = 0,
    currTimelineIndex = 1,
    timelineArray = [],
    isMousePressed = true
    isMouseAllowedToDrag = true;
var timelineTitle = [],
    timelineContent = [];
var projectTitle = [],
    projectTags = [],
    projectText = [],
    projectLinks = [],
    projectFilteredTags = [],
    isFilterLoading = false,
    projectIndex = -1;
var isFormOut = false;


const formatToIndividualDiv = (el, original) => {
    let elString;
    if (original == "") {
        elString = el.innerText.split(" ");
    } else {
        elString = original.split(" ");
    }
    let isPrevStringEnough = false;
    let prevString = "",
        testString = "",
        prevWord = "",
        appendString = "",
        counter = 0;

    el.innerHTML = "<div class=\"fill_text\">test</div>";
    let oneLineHeight = el.getElementsByTagName("div")[0].clientHeight

    for (let words of elString) {

        if (!isPrevStringEnough) {
            testString = `<div class="fill_text">${testString + words + " "}</div>`;
        } else {
            testString = `<div class="fill_text">${prevWord + " " + words + " "}</div>`;
            isPrevStringEnough = false;
        }

        el.innerHTML = testString;
        if ( words == "/new-line/") {
            appendString = appendString + testString.substring(0, testString.length - 17) + "</div><div class=\"fill_text new_line\" style=\"opacity: 0\">.</div>";
            testString = ""
            counter++
        } else {

            if (el.getElementsByTagName("div")[0].clientWidth ==  el.clientWidth && el.getElementsByTagName("div")[0].clientHeight > oneLineHeight){
                appendString = appendString + prevString
                isPrevStringEnough = true;
            }
    
            counter++
            if (counter == elString.length && !isPrevStringEnough) {
                appendString = appendString + testString;
            } else {
                if (counter == elString.length && isPrevStringEnough){
                    appendString = appendString + `<div class="fill_text">${words}</div>`
                }
            }
            
            prevWord = words;
            prevString = testString;
            testString = testString.substring(23,testString.length - 6)
        }
        
    }

    el.innerHTML = appendString;

    for (let innerEl of el.getElementsByClassName("fill_text")) {
        innerEl.innerHTML = `<div></div><div>${innerEl.innerText}</div>`
    }
    
}

const createTimeline = (isWindowResize) => {
    let container = document.getElementById("timeline_line_container")
    let events = document.getElementById("timeline_line")
    let vw = document.documentElement.clientWidth/100
    let sumDistance = 0;
    let timelineHalfWidth = document.getElementById("timeline_line_container").clientWidth / 2

    timeline.style.setProperty("--timeline-half-width", `${timelineHalfWidth}px`)
    timelineArray = []

    events.innerHTML = timelineEventsText.split(";").map(
        (event) => {
            if (event != "") {
                let array = event.split(":")
                sumDistance = sumDistance + (array[1] * vw);
                timelineArray.push(sumDistance)
                return `<div class="timeline_event" style="--distance:${sumDistance}px;"><div class="timeline_event_date">${array[0]}</div></div>`
            }
            return ""
        }
    ).join("")
        
    events.style.setProperty("--timeline-line-width", `${sumDistance}px` )
    timelineTitle = []
    timelineContent = []

    for (let slide of timelineTextSlides) {
        if (slide != "") {
            timelineTitle.push(slide.split(":")[0])
            timelineContent.push(slide.split(":")[1])
        }
    }

    const changeTimelineText = () => {

        formatToIndividualDiv(timelineText, timelineContent[timelineIndex])

        let titleDate = timelineTitle[timelineIndex].split("•")
        let formatedTitle =  "<div id=\"timeline_date\">•" + titleDate[1] + "•</div>"

        timelineText.innerHTML = "<div id=\"timeline_title\">" + titleDate[0] + "</div>" + formatedTitle + timelineText.innerHTML

        currTimelineIndex = timelineIndex
    }


    container.onmousedown = e => {
            isMousePressed = true
            startOffset = e.screenX
            container.style.cursor = "grabbing"
    }

    const exit = () => {
        if (!isMousePressed) return
        isMousePressed = false
        container.style.cursor = "grab"

        let regExp = /\(([^)]+)\)/;
        let matches = regExp.exec(events.style.getPropertyValue("transform"));
        let prevExitOffset = exitOffset

        if (matches == null) {
            matches = ["0px", "0px"]
        }

        exitOffset = parseInt(matches[1].substring(0, matches[1].length - 2))

        let distanceFromEvent = timelineArray.map(
            (transX) => {
                return Math.abs(transX + exitOffset)
            }
        )
        let eventIndex = distanceFromEvent.indexOf(Math.min(...distanceFromEvent))
        
        if (!isMouseAllowedToDrag) {
            anime({
                targets: events,
                translateX: [exitOffset, -timelineArray[timelineIndex]],
                easing: "spring(1, 80, 90, 0)"
            })
            exitOffset = prevExitOffset
            return
        }

        anime ({
            targets: events,
            translateX: [exitOffset, -timelineArray[eventIndex]],
            duration: 650,
            easing: "easeOutElastic(1, .6)",
            begin: () => {
                exitOffset = -timelineArray[eventIndex]
                timelineIndex = eventIndex

                if (currTimelineIndex != timelineIndex) {
                    isMouseAllowedToDrag = false;

                    anime({
                        targets: "#timeline_title, #timeline_date, #timeline_content .fill_text:not(.new_line)",
                        opacity: [1, 0],
                        duration: 800,
                        easing: "linear",
                        complete: () => {
                            timeline.style.setProperty("--op-fill-text", 0)
    
                            changeTimelineText()
    
                            anime({
                                targets:"#timeline_title, #timeline_date",
                                opacity:[0,1],
                                duration: 800,
                                easing: "linear",
                                complete: () => {
                                    
                                    anime({
                                        targets:"#timeline_content .fill_text div:first-child",
                                        right: ["50%", 0],
                                        left: ["50%", 0],
                                        duration: 300,
                                        delay: anime.stagger(100),
                                        easing: "easeOutSine",
                                        complete: () => {
                                            timeline.style.setProperty("--op-fill-text", 1)
            
                                            anime({
                                                targets:"#timeline_content .fill_text div:first-child",
                                                right: [0, "50%"],
                                                left: [0, "50%"],
                                                duration: 300,
                                                delay: anime.stagger(100),
                                                easing: "easeOutSine",
                                                complete: () => {
                                                    isMouseAllowedToDrag = true;
                                                    container.style.cursor = "grab"
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    }

    container.addEventListener("mouseup", exit)
    container.addEventListener("mouseleave", exit)

    container.onmousemove = e => {
        if(!isMousePressed) return
        e.preventDefault();

        let move = e.screenX - startOffset + exitOffset     
        if (-move > 0 && -move < sumDistance) {
            events.style.setProperty("transform", `translateX(${move}px)`)
        }
        
    }
    
    if (isWindowResize) currTimelineIndex = -1

    exit()
    
}

const createProject = () => {
    let emptyProjectTags = document.getElementById("project_search")
    let emptyProjectContent = document.getElementById("project_content")
    emptyProjectContent.innerHTML = ""
    project.style.removeProperty("--project-content-height")
    project.style.setProperty("--project-content-height", `${emptyProjectContent.clientHeight}px`)
    
    
    let createProjectHtmlArray = []
    let uniqueTag = [];
    let projectTagHtml = "";
    let projectHtml = "";
    projectFilteredTags = [];
    projectTitle = [];
    projectTags = [];
    projectText = [];
    projectLinks = [];
    
    const createProjectHtml = (array) => {
        for (let i = 0; i < array.length; i++) {
    
            let tagHtml = ""
    
            for (let tag of projectTags[array[i]]) {
                tagHtml += `<div class="project_tag">${tag}</div>`
            }
    
            projectHtml += `<article class="project_tab">
                                <div class="project_header">
                                    <div class="project_title">
                                        <h3>${projectTitle[array[i]]}</h3>
                                    </div>
                                    <div class="project_tags">${tagHtml}</div>
                                </div>
                            </article>`
        }    
    }

    const updateFilter = () => {

            createProjectHtmlArray = []

            let prevFilteredTags = []
            for (let filteredTags of projectFilteredTags) {
                prevFilteredTags.push(filteredTags)
            }
            let isTabPass = false;
            let tagTemp = [];
            let tagArray = [];

            if (projectFilteredTags.length == 0) {
                for (let i = 0; i < projectContent.length - 1; i++) {
                    createProjectHtmlArray.push(i)
                }
            
                createProjectHtml(createProjectHtmlArray)
            } else {
                for (let i = 0; i < projectTags.length; i++) {
                    for (let j = 0; j < projectTags[i].length; j++){
                        for (let k = 0; k < projectFilteredTags.length; k++){
                            if (projectTags[i][j] == projectFilteredTags[k]) {
                                if (!isTabPass) createProjectHtmlArray.push(i)
                                isTabPass = true;
                                
                                tagTemp.push(j);
                            }
                        }
                    }
                    tagArray.push(tagTemp);
                    tagTemp = [];
                    isTabPass = false;
                }
            }

            anime({
                targets: ".project_tab",
                opacity: [1, 0],
                duration: 700,
                delay: anime.stagger(100, {direction: 'reverse'}),
                complete: () => {
                    emptyProjectContent.innerHTML = ""
                    projectHtml = ""
                    createProjectHtml(createProjectHtmlArray)
                    emptyProjectContent.innerHTML = projectHtml;

                    anime({
                        targets: ".project_tab",
                        opacity: [0, 1],
                        duration: 700,
                        delay: anime.stagger(100),
                        complete: () => {

                            let highlightTag = [];
                            let highlightTagCounter = 0;

                            for (let i = 0; i < tagArray.length; i++){
                                if (tagArray[i].length > 0) {
                                    for (let index of tagArray[i]){
                                        let highlightTagTemp = document.getElementsByClassName("project_tab")[highlightTagCounter] 
                                        highlightTag.push(highlightTagTemp.getElementsByClassName("project_tag")[index])
                                    }
                                    highlightTagCounter++
                                }
                            }
                            
                            anime({
                                targets: highlightTag, 
                                color: "#ea4a49",
                                fontWeight: "bold",
                                duration: 2000
                            })


                            let isUpdateFilterTriggered = false;
                            if (prevFilteredTags.length != projectFilteredTags.length) {
                                updateFilter()
                                isUpdateFilterTriggered = true;
                            } else  {
                                for (let i = 0; i < prevFilteredTags.length; i++){
                                    if (projectFilteredTags.indexOf(prevFilteredTags[i]) == -1) {
                                        updateFilter()
                                        isUpdateFilterTriggered = true;
                                        break;
                                    }
                                }
                            }
    
                            if (!isUpdateFilterTriggered) {
                                CreateTabClickListener()
                                isFilterLoading = false;   
                            }  
                            
                        }
                    })
                }
            })
    }

    const CreateTabClickListener = () => {
        let projectContent = document.getElementById("project_content")
        for (let tabs of projectContent.getElementsByClassName("project_tab")) {
            tabs.onclick = e => {
                let title = e.currentTarget.getElementsByClassName("project_title")[0]
                let titleString = title.innerText
                projectIndex = projectTitle.indexOf(title.innerText.trim())
                
                projectExpandedCover.classList.add("project_expanded_toggle")
                
                projectExpandedCover.innerHTML = "<div id=\"project_expanded\"></div>"
                
                let projectExpanded = document.getElementById("project_expanded")
                
                tagHtml = ""
                
                console.log(projectTags)
                console.log(projectIndex)
                for (let tag of projectTags[projectIndex]) {
                    tagHtml += `<div class="project_tag">${tag}</div>`
                }
                
                projectExpanded.innerHTML = `<article class="project_tab"></article>`
    
                anime({
                    targets: "#project_expanded",
                    width: [0, "80vw"],
                    height: [0, "100%"],
                    duration: 1000,
                    complete: () => {
                        projectExpanded.innerHTML = `<article class="project_tab">
                                                <div class="project_header">
                                                    <div class="project_title">
                                                        <h3>${projectTitle[projectIndex]}</h3>
                                                        <i id="close_project" class="fa-regular fa-circle-xmark"></i>
                                                    </div>
                                                    <div class="project_tags">${tagHtml}</div>
                                                </div>
                                                <div id="project_text"></div>
                                            </article>`
                        
                        let projectHeader = projectExpanded.getElementsByClassName("project_header")[0]

                        projectExpanded.getElementsByTagName("i")[0].onclick = e => {
                            e.stopPropagation()
                            closeProject()
                        }
                        
                        anime({
                            targets: projectHeader,
                            opacity: [0, 1],
                            duration: 1000
                        })

                        let projectExpandedText = document.getElementById("project_text")
                        formatToIndividualDiv(projectExpandedText, projectText[projectIndex])

                        projectExpandedText.innerHTML =  projectExpandedText.innerHTML + `<div class="fill_text new_line" style="opacity: 0">
                                                                                            <div></div>
                                                                                            <div>.</div>
                                                                                          </div>
                                                                                          <div class="fill_text">
                                                                                            <div></div>
                                                                                            <div>
                                                                                                <a id="project_link" href="https://${projectLinks[projectIndex]}" target="_blank">link to the project</a>
                                                                                            </div>
                                                                                          </div>`
                        
                        document.getElementById("project_link").onclick = e => {
                            window.open(e.currentTarget.getAttribute("href"), "_blank")
                        }
                        projectExpandedText.style.setProperty("--op-fill-text", 0)
                        
                        anime({
                            targets:"#project_text .fill_text div:first-child",
                            right: ["100%", 0],
                            duration: 300,
                            delay: anime.stagger(100),
                            easing: "easeOutSine",
                            complete: () => {
                                projectExpandedText.style.setProperty("--op-fill-text", 1)
                                
                                anime({
                                    targets:"#project_text .fill_text div:first-child",
                                    right: [0, "100%"],
                                    duration: 300,
                                    delay: anime.stagger(100),
                                    easing: "easeOutSine"
                                })
                            }
                        })
                    }
                })       
            }
        }
    }

    for (let project of projectContent) {
        if (project.trim() != "") {
            projectTitle.push(project.trim().split(":")[0]);
            let temp = project.trim().split(":")[1];
            temp = temp.replace(/  +/g, " ");
            projectTags.push(temp.split(","));
            projectText.push(project.trim().split(":")[2]);
            projectLinks.push(project.trim().split(":")[3])
        }
    }

    for (let tags of projectTags) {
        for (let tag of tags) {
            if (tag != "" && uniqueTag.indexOf(tag) == -1){
                uniqueTag.push(tag)
                projectTagHtml += `<div class="project_tag">${tag}</div>`
            }

        }
    }

    for (let i = 0; i < projectContent.length - 1; i++) {
        createProjectHtmlArray.push(i)
    }

    createProjectHtml(createProjectHtmlArray)
    
    emptyProjectTags.innerHTML = projectTagHtml;
    emptyProjectContent.innerHTML = projectHtml;

    let projectTagFilterBtn = emptyProjectTags.getElementsByClassName("project_tag")

    projectExpandedCover.onclick = e => {
        e.preventDefault()
        
        if (e.target === e.currentTarget) {
            closeProject()
        }
    }

    CreateTabClickListener()

    for (let tagBtn of projectTagFilterBtn) {
        tagBtn.onclick = e => {
            e.currentTarget.classList.toggle("project_tag_toggle")

            if (projectFilteredTags.indexOf(e.currentTarget.innerText) == -1) {
                projectFilteredTags.push(e.currentTarget.innerText)
            } else {
                projectFilteredTags.splice(projectFilteredTags.indexOf(e.currentTarget.innerText), 1)
            }
            
            if (!isFilterLoading) updateFilter(e);
            isFilterLoading = true;
        };
    }

}

const closeProject = () => {
    let projectExpanded = document.getElementById("project_expanded")
    if (projectExpanded == null) return
    projectExpandedCover.classList.remove("project_expanded_toggle")
    
    anime({
        targets: "#project_expanded .project_header, #project_text",
        opacity: [1,0],
        duration: 1000
    })
    
    anime({
        targets: "#project_expanded",
        width: ["80vw", 0],
        height: ["100%", 0],
        opacity: [1, 0],
        duration: 1000,
        easing: "spring(2, 80, 18, 1.8)",
        complete: () => {
            projectExpanded.innerHTML = "";
        }
    })
}

const handleChangeOnClick = (x, y) => {
    const findCurrTrans = (el, dimension) => {
        let matches = "";
        
        if (el.style.getPropertyValue("transform") == ""){
            matches = "0px";
        } else {
            let temp = el.style.getPropertyValue("transform").split("(")
            let counter = 0;
            
            for (let bracket of temp) {
                if (counter == dimension) {
                    matches = bracket.split(")"); 
                }   
                counter++;
            }
        }
        
        return matches;
    }
    
    
    anime ({
        targets: "#main_bg",
        translateX: (el) => { 
            return [findCurrTrans(el, 1), `${x}px`]
        },
        translateY: (el) => { 
            return [findCurrTrans(el, 2), `${y}px`]
        }, 
        duration: () => {
            switch(currentPage){
                case 2:
                    if(!isAboutLoaded){
                        return 700
                    }
                    break;
                case 3:
                    if(!isTimelineLoaded){
                        return 700
                    }
                    break;
                case 4:
                    if(!isProjectLoaded){
                        return 700
                    }
                    break;
            }
            return 2000
        },
        easing: () => {
            switch(currentPage){
                case 2:
                    if(!isAboutLoaded){
                        return "easeOutSine"
                    }
                    break;
                case 3:
                    if(!isTimelineLoaded){
                        return "easeOutSine"
                    }
                    break;
                case 4:
                    if(!isProjectLoaded){
                        return "easeOutSine"
                    }
                    break;
            }
            return "spring(2, 80, 18, 1.8)"
        },
        begin: () => {
            setNewPage(currentPage)
        },
        complete: () => {
            switch(currentPage){
                case 2:
                    if(!isAboutLoaded){
                        loadAbout();
                    }
                    isAboutLoaded = true;
                    break;
                case 3:
                    if(!isTimelineLoaded){
                        loadTimeline();
                    }
                    isTimelineLoaded = true;
                    break;
                case 4:
                    if(!isProjectLoaded){
                        loadProject();
                    }
                    isProjectLoaded = true;
                break;
            }
        }
    })
}

const setNewPage = (currentPage) => {
    switch(currentPage){
        case 2:
            if(!isAboutLoaded){
                about.style.setProperty("--op-about-me", 0);
                about.style.setProperty("--op-profile", 0);
                about.style.setProperty("--op-fill-text", 0);
                about.style.setProperty("--op-nav", 0);
            }
            break;
        case 3:
            if(!isTimelineLoaded){
                timeline.style.setProperty("--op-timeline", 0);
                timeline.style.setProperty("--op-timeline-shadow", 0);
                timeline.style.setProperty("--op-timeline-events", 0);
                timeline.style.setProperty("--op-timeline-title", 0);
                timeline.style.setProperty("--op-timeline-date", 0);
                timeline.style.setProperty("--op-fill-text", 0)
                timeline.style.setProperty("--op-nav", 0);
                let timelineTitleStyle = document.getElementById("timeline_title")
                let timelineDateStyle = document.getElementById("timeline_date")
                try {
                    timelineTitleStyle.removeAttribute("style")
                    timelineDateStyle.removeAttribute("style")
                } catch (err) {
                    
                }
            }
            break;
        case 4:
            if(!isProjectLoaded){
                project.style.setProperty("--op-nav", 0);
                project.style.setProperty("--op-project", 0)
                document.getElementById("project_search").style.setProperty("opacity", 0)
                document.getElementById("project_content").style.setProperty("opacity", 0)
                for (let tabs of document.getElementsByClassName("project_tab")) {
                    tabs.style.setProperty("opacity", 0)
                }
            }
        break;
    }
}

const loadAbout = () => {
    let aboutNav = document.getElementById("about_nav_container")
    aboutNav.style.setProperty("--nav-height", `${aboutNav.clientHeight}px`)

    anime({
        targets: '#about_me',
        width: [0,"8ch"],
        duration: 800,
        easing: 'steps(8)',
        begin: () => {
            about.style.setProperty("--op-about-me", 1);
            
            let blinkerObj = document.createElement("div")
            blinkerObj.classList.add("sub_blinker")
            
            let blinkerTarget = about.getElementsByClassName("typing")[0]
            blinkerTarget.appendChild(blinkerObj)
        },
        complete: () => {
            anime ({
                targets:"#about_text .fill_text div:first-child",
                right: ["100%", 0],
                duration: 150,
                delay: anime.stagger(100),
                easing: "easeOutSine",
                complete: () => {
                    about.style.setProperty("--op-fill-text", 1)

                    anime ({
                        targets:"#about_text .fill_text div:first-child",
                        right: [0, "100%"],
                        duration: 150,
                        delay: anime.stagger(100),
                        easing: "easeOutSine",
                        complete: () => {
                            about.classList.add("border_toggle")

                            anime ({
                                targets: "#profile > img",
                                translateY: ["100vh", 0],
                                duration: 1000,
                                delay: 1000,
                                endDelay: 1000,
                                easing: "easeOutSine",
                                begin: () => {
                                    about.style.setProperty("--op-profile", 1)
                                },
                                complete: () => {
                                    anime({
                                        targets: "#about_nav_container span",
                                        keyframes: [
                                            {opacity: [0,1]},
                                            {translateY: "-100%"},
                                            {rotate: anime.stagger([0, 360])}
                                        ],
                                        duration: 500,
                                        delay:  anime.stagger(50, {direction: 'reverse'}),
                                        easing: "easeInOutSine",
                                        begin: () => {
                                            about.style.setProperty("--op-nav", 1);
                                        },
                                        complete: () => {
                                            anime({
                                                targets: "#about_nav_container .circle_text",
                                                rotate: [0,360],
                                                loop: true,
                                                duration: 25000,
                                                easing: "linear"
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })

    
}

const loadTimeline = () => {
    let timelineNav = document.getElementById("timeline_nav_container")
    let timelineArrow = document.getElementById("timeline_selector_arrow")
    timelineNav.style.setProperty("--nav-height", `${timelineNav.clientHeight}px`)
    timelineArrow.style.setProperty("--arrow-height", `${timelineArrow.clientHeight * 0.5}px`)


    anime({
        targets: '#timeline',
        width: [0,"8ch"],
        duration: 800,
        easing: 'steps(8)',
        begin: () => {
            timeline.style.setProperty("--op-timeline", 1);
            
            let blinkerObj = document.createElement("div")
            blinkerObj.classList.add("sub_blinker")
            
            let blinkerTarget = timeline.getElementsByClassName("typing")[0]
            blinkerTarget.appendChild(blinkerObj)
        },
        complete: () => {

            anime({
                targets: "#timeline_dragable_shadow",
                right: ["50%", 0],
                left: ["50%", 0],
                duration: 1250,
                easing: "easeInOutSine",
                begin: () => {
                    timeline.style.setProperty("--op-timeline-shadow", 1)
                },
                complete: () => {
                    timeline.classList.add("border_toggle")

                    anime({
                        targets: "#timeline_line",
                        opacity: [0, 1],
                        duration: 1000,
                        easing: "easeInOutSine",
                        complete: () => {
                            timeline.style.setProperty("--op-timeline-events", 1)
                            timeline.style.setProperty("--op-timeline-title", 1)
                            timeline.style.setProperty("--op-timeline-date", 1)
    
                            anime({
                                targets: "#timeline_title, #timeline_date",
                                opacity: [0,1],
                                duration: 1000,
                                easing: "easeInOutSine",
                                complete: () => {
                                    
                                    anime ({
                                        targets:"#timeline_content .fill_text div:first-child",
                                        right: ["50%", 0],
                                        left: ["50%", 0],
                                        duration: 500,
                                        delay: anime.stagger(100),
                                        easing: "easeOutSine",
                                        complete: () => {
        
                                            timeline.style.setProperty("--op-fill-text", 1)
                        
                                            anime ({
                                                targets:"#timeline_content .fill_text div:first-child",
                                                right: [0, "50%"],
                                                left: [0, "50%"],
                                                duration: 500,
                                                delay: anime.stagger(100),
                                                easing: "easeOutSine",
                                                complete: () => {
        
                                                    anime({
                                                        targets: "#timeline_nav_container span",
                                                        keyframes: [
                                                            {opacity: [0,1]},
                                                            {translateY: "-100%"},
                                                            {rotate: anime.stagger([0, 360])}
                                                        ],
                                                        duration: 500,
                                                        delay:  anime.stagger(50, {direction: 'reverse'}),
                                                        easing: "easeInOutSine",
                                                        begin: () => {
                                                            timeline.style.setProperty("--op-nav", 1);
                                                        },
                                                        complete: () => {
                                                            anime({
                                                                targets: "#timeline_nav_container .circle_text",
                                                                rotate: [0,360],
                                                                loop: true,
                                                                duration: 25000,
                                                                easing: "linear"
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

const loadProject = () => {
    let projectNav = document.getElementById("project_nav_container")
    projectNav.style.setProperty("--nav-height", `${projectNav.clientHeight}px`)

    anime({
        targets: '#project',
        width: [0,"8ch"],
        duration: 800,
        easing: 'steps(8)',
        begin: () => {
            project.style.setProperty("--op-project", 1);
            
            let blinkerObj = document.createElement("div")
            blinkerObj.classList.add("sub_blinker")
            
            let blinkerTarget = project.getElementsByClassName("typing")[0]
            blinkerTarget.appendChild(blinkerObj)
        }, 
        complete: () => {
            anime({
                targets: "#project_search",
                opacity: [0, 1],
                duration: 1000,
                easing: "linear",
                complete: () => {
                    anime({
                        targets: "#project_content",
                        opacity: [0, 1],
                        duration: 1000,
                        easing: "linear",
                        complete: () => {
                            anime({
                                targets: "#project_nav_container span",
                                keyframes: [
                                    {opacity: [0,1]},
                                    {translateY: "-100%"},
                                    {rotate: anime.stagger([0, 360])}
                                ],
                                duration: 500,
                                delay:  anime.stagger(50, {direction: 'reverse'}),
                                easing: "easeInOutSine",
                                begin: () => {
                                    project.style.setProperty("--op-nav", 1);
                                },
                                complete: () => {
                                    anime({
                                        targets: "#project_nav_container .circle_text",
                                        rotate: [0,360],
                                        loop: true,
                                        duration: 25000,
                                        easing: "linear"
                                    })
                                }
                            })
                        }
                    })

                    anime({
                        targets: ".project_tab",
                        opacity: [0, 1],
                        duration: 1000,
                        delay: anime.stagger(300)
                    })
                }
            })
        }
    })

}

const toggleForm = () => {

    if (isFormOut) {
        anime({
            targets: "#form_container",
            opacity: [1,0],
            duration: 1000,
            easing: "easeInSine",
            complete: () => {
                document.getElementById("feedback_block_container").style.setProperty("z-index", 1)
                for (let block of document.getElementsByClassName("feedback_block")) {
                    block.style.setProperty("transform", "translateX(-100%)")
                }
                document.getElementById("feedback_form").style.setProperty("transform", "translateX(100%)")
                
                anime ({
                    targets: ".feedback_block",
                    translateX: ["-100%",0],
                    duration: 1500,
                    delay: anime.stagger(100, {direction: 'reverse'}),
                    easing: "easeInOutSine",
                    complete: () => {
                        isFormOut = false;
                    }
                })

            }
        })
    } else {
        anime({
            targets: ".feedback_block",
            translateX: [0, "-100%"],
            duration: 1500,
            delay: anime.stagger(100),
            easing: "easeInOutSine",
            complete: () => {
                
                for (let block of document.getElementsByClassName("feedback_block")) {
                    block.style.setProperty("transform", "translateX(0)")
                }
                
                document.getElementById("feedback_form").style.setProperty("transform", "translateX(0)")
                document.getElementById("form_container").style.setProperty("opacity", 0)
                document.getElementById("feedback_block_container").style.setProperty("z-index", -1)
                
                anime({
                    targets: "#form_container",
                    opacity: [0,1],
                    duration: 1000,
                    easing: "easeOutSine",
                    complete: () => {
                        isFormOut = true;
                    }
                })

            }
        })
    }
}

document.fonts.ready.then(() => {
    formatToIndividualDiv(aboutText, "")
    createTimeline()
    createProject()
    
    for (let i = 1; i <= 4; i++){
        setNewPage(i)
    }

});

changeToMain[0].onclick = e => {
    currentPage = 1;
    closeProject()
    handleChangeOnClick(0, 0)
};
changeToMain[1].onclick = e => {
    currentPage = 1;
    handleChangeOnClick(0, 0)
};
changeToAbout[0].onclick = e => {
    currentPage = 2;
    closeProject()
    handleChangeOnClick(0, (-1 * main.clientHeight))
};
changeToAbout[1].onclick = e => {
    currentPage = 2;
    handleChangeOnClick(0, (-1 * main.clientHeight))
};
changeToTimeline[0].onclick = e => {
    currentPage = 3;
    closeProject()
    handleChangeOnClick((-1 * main.clientWidth), (-1 * main.clientHeight))
};
changeToTimeline[1].onclick = e => {
    currentPage = 3;
    handleChangeOnClick((-1 * main.clientWidth), (-1 * main.clientHeight))
};
changeToProject[0].onclick = e => {
    currentPage = 4;
    closeProject()
    handleChangeOnClick((-1 * main.clientWidth), 0)
};
changeToProject[1].onclick = e => {
    currentPage = 4;
    handleChangeOnClick((-1 * main.clientWidth), 0)
};

document.getElementById("select_feedback").onclick = e => {
    toggleForm()
}

document.getElementById("close_form").onclick = e => {
    toggleForm()
}

var isUserWindowAlerted = false;







if(!navigator.userAgent.match(/chrome|chromium|crios/i)){
    alert("This website runs best on chrome browsers, some features may not work as intended. Please revisit using a chrome browser, Thank you !")
}
if (window.innerWidth <= 1025 && !isUserWindowAlerted) {
    alert("Unfortunately this website is currently available for mobile devices :( Please revisit with a wider screen, Thank you !")
    isUserWindowAlerted = true
}


//Window resize
const updateWindow = () => {
    
    if (window.innerWidth <= 1025 && !isUserWindowAlerted) {
        alert("Unfortunately this website not available for mobile devices :( Please revisit with a wider screen, Thank you !")
        isUserWindowAlerted = true
    }
    
    createGrid();
    
    main.style.setProperty("--header-height", `${document.getElementsByTagName("header")[0].clientHeight}px`);
    
    let mainNav = document.getElementById("main_nav_container")
    mainNav.style.setProperty("--nav-height", `${mainNav.clientHeight}px`)
    let aboutNav = document.getElementById("about_nav_container")
    aboutNav.style.setProperty("--nav-height", `${mainNav.clientHeight}px`)
    let timelineNav = document.getElementById("timeline_nav_container")
    timelineNav.style.setProperty("--nav-height", `${mainNav.clientHeight}px`)
    let projectNav = document.getElementById("project_nav_container")
    projectNav.style.setProperty("--nav-height", `${mainNav.clientHeight}px`)
    
    let main_bg = document.getElementById("main_bg");
    switch(currentPage){
        case 1:
            handleChangeOnClick(0, 0)
            break;
        case 2:
            handleChangeOnClick(0, (-1 * main.clientHeight))
            break;
        case 3:
            handleChangeOnClick((-1 * main.clientWidth), (-1 * main.clientHeight))
            break;
        case 4:
            handleChangeOnClick((-1 * main.clientWidth), 0)
            break;
    }

    formatToIndividualDiv(aboutText, aboutFillText)
    createTimeline()
    createProject()
    let projectExpandedText = document.getElementById("project_text")
    try {
        formatToIndividualDiv(projectExpandedText, projectText[projectIndex])
        projectExpandedText.innerHTML =  projectExpandedText.innerHTML + `<div class="fill_text new_line" style="opacity: 0">
                                                                            <div></div>
                                                                            <div>.</div>
                                                                          </div>
                                                                          <div class="fill_text">
                                                                            <div></div>
                                                                            <div><a id="project_link" href="https://${projectLinks[projectIndex]}" target="_blank">link to the project</a></div>
                                                                          </div>`
        document.getElementById("project_link").onclick = e => {
            window.open(e.currentTarget.getAttribute("href"), "_blank")
        }
    } catch (err) {

    }
}

window.onresize = () => updateWindow();