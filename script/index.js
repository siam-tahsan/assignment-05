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
    
    let issuesContainer = document.getElementById('issues-container');
    issuesContainer.innerHTML = '';

    issues.forEach(issue => {
        let issueCard = document.createElement('div');
        let borderColor = issue.status === "open" ? "border-green-500" : "border-purple-500";
        issueCard.innerHTML = `
        <div class="bg-white shadow rounded-lg p-4 h-full border-t-4 ${borderColor}">

            <h3 class="font-bold text-lg mb-2">${issue.title}</h3>

            <p class="text-sm text-gray-500 mb-3">
                ${issue.description}
            </p>

            <p><strong>Status:</strong> ${issue.status}</p>
            <p><strong>Author:</strong> ${issue.author}</p>
            <p><strong>Priority:</strong> ${issue.priority}</p>
            <p><strong>Label:</strong> ${issue.label}</p>
            <p class="text-xs text-gray-400 mt-2">${issue.createdAt}</p>

        </div>
        `
        issuesContainer.appendChild(issueCard);
    });
}


allBtn.addEventListener("click", function (){
    resetBnts();
    allBtn.classList.add('btn-primary');
    displayIssues(allIssues);
});

openBtn.addEventListener('click', function () {
    resetBnts();
    openBtn.classList.add('btn-primary');
    let openIssues = allIssues.filter(issue => issue.status === 'open');
    displayIssues(openIssues)
})

closedBtn.addEventListener("click", function(){
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
