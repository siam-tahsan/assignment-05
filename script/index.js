let allIssues = [];

let spinner = document.getElementById("loading-spinner");


let allBtn = document.getElementById('all-btn');
let openBtn = document.getElementById('open-btn');
let closedBtn = document.getElementById('closed-btn');

let searchBtn = document.getElementById('search-btn');
let searchInput = document.getElementById('search-input');



let loadIssues = () => {
    spinner.classList.remove("hidden");
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
        .then(res => res.json())
        .then(json => {
            allIssues = json.data;
            displayIssues(allIssues);
        })
}

let displayIssues = (issues) => {
    spinner.classList.add("hidden");

    document.getElementById("issues-count").innerText = issues.length + " Issues";

    let issuesContainer = document.getElementById('issues-container');
    issuesContainer.innerHTML = '';

    issues.forEach(issue => {
        let issueCard = document.createElement('div');
        let borderColor = issue.status === "open" ? "border-green-500" : "border-purple-500";
        issueCard.innerHTML = `
        <div class="bg-white shadow-md rounded-lg p-5 h-full border-t-4 ${borderColor} flex flex-col justify-between">

    <!-- top section -->
    <div class="flex justify-between items-center mb-3">   
        <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <span class="text-green-600 text-lg">${openClosedTag(issue.status)}</span>
        </div>

        <span class="px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(issue.priority)}">
            ${issue.priority.toUpperCase()}
        </span>
    </div>
    
    <h3 class="font-bold text-lg mb-2">
        ${issue.title}
    </h3>

    <!-- description -->
    <p class="text-gray-500 text-sm mb-4">
        ${issue.description}
    </p>

    <!-- labels -->
    <div class="flex gap-2 mb-4">
        ${issue.labels.map(label => createLabel(label)).join("")}
    </div>

    <!-- footer -->
    <div class="border-t pt-3 text-sm text-gray-500">
        <p>#${issue.id} by ${issue.author}</p>
        <p>${issue.createdAt}</p>
    </div>

</div>
        `
        issuesContainer.appendChild(issueCard);

        issueCard.addEventListener("click", function(){
        openIssueModal(issue.id)})
    });
}

function getPriorityColor(priority){

    if(priority === "high"){
        return "bg-red-100 text-red-600";
    }

    if(priority === "medium"){
        return "bg-yellow-100 text-yellow-600";
    }

    if(priority === "low"){
        return "bg-gray-100 text-gray-600";
    }

    return "bg-gray-100 text-gray-600";
}

function createLabel(label){

    if(label === "bug"){
        return `<span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">BUG</span>`;
    }

    if(label === "help wanted"){
        return `<span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">HELP WANTED</span>`;
    }

    if(label === "enhancement"){
        return `<span class="px-2 py-1 text-xs rounded-full bg-blue-200 text-blue-600">ENHANCEMENT</span>`;
    }

    return `<span class="px-2 py-1 text-xs rounded-full bg-red-200 text-red-600">${label}</span>`;
}

function openClosedTag(status){
    if(status === "open"){
        return `<img src="./assets/Open-Status.png" alt="">`
    }
    else{
        return `<img src="./assets/Closed- Status .png" alt="">`
    }
}

function openIssueModal(id){

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then(res => res.json())
    .then(data => {
        showModal(data.data);
    });

}

function showModal(issue){

    document.getElementById("modal-title").innerText = issue.title;

    document.getElementById("modal-description").innerText = issue.description;

    document.getElementById("modal-author").innerText = "#" + issue.id + " by " + issue.author;

    document.getElementById("modal-created").innerText = issue.createdAt;

    document.getElementById("modal-status-icon").innerHTML = openClosedTag(issue.status);

    document.getElementById("modal-priority").innerText = issue.priority.toUpperCase();
    document.getElementById("modal-priority").className =
        "px-3 py-1 text-xs font-semibold rounded-full " + getPriorityColor(issue.priority);

    document.getElementById("modal-labels").innerHTML =
        issue.labels.map(label => createLabel(label)).join("");

    document.getElementById("issue-modal").showModal();
}


allBtn.addEventListener("click", function (){
    spinner.classList.remove("hidden");
    resetBnts();
    allBtn.classList.add('btn-primary');
    displayIssues(allIssues);
});

openBtn.addEventListener('click', function () {
    spinner.classList.remove("hidden");
    resetBnts();
    openBtn.classList.add('btn-primary');
    let openIssues = allIssues.filter(issue => issue.status === 'open');
    displayIssues(openIssues)
})

closedBtn.addEventListener("click", function(){
    spinner.classList.remove("hidden");
    resetBnts();
    closedBtn.classList.add('btn-primary');

    let closedIssues = allIssues.filter(issue => issue.status === "closed");

    displayIssues(closedIssues);

});

function resetBnts(){
    allBtn.classList.remove('btn-primary');
    openBtn.classList.remove('btn-primary');
    closedBtn.classList.remove('btn-primary');
}

searchBtn.addEventListener('click', function(){
    let searchText = searchInput.value;
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`)
    .then(res => res.json())
    .then(data =>{
        displayIssues(data.data);
    })
})

searchInput.addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        searchBtn.click();
    }
})

loadIssues()
