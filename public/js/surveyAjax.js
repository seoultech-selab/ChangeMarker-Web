function surveySubmit() {
    let formData = new Object();
    formData.user_code = document.getElementById("userCode").value;
    formData.email = document.getElementById("email").value;
    formData.job = document.getElementById("job").value;

    $.ajax({
        type: 'post',
        url: '/survey',
        data: formData,
        dataType: 'json',
        success: function(res) {
            document.getElementById("survey").style.display = "none";
            document.getElementById("display_user_code").style.display = "block";
        }
    });
}
