// IIFE -- Immediately Invoked Function Expression
(function(){

    function Start()
    {
        console.log("App Started...");
        let deleteButtons = document.querySelectorAll('.btn-danger');
        for (button of deleteButtons)
        //little foreach loop - for every button node in button danger class list
        {
            button.addEventListener('click', (event) =>{
                if (!confirm("Are you sure?"))
                {
                    event.preventDefault();
                    window.location.assign('/surveys');
                }
            });
        }
    }

    window.addEventListener("load", Start);

})();