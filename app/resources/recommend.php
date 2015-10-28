<?php
$action = $_REQUEST['action'];

if ($action === "submit") {
    $senderName = $_REQUEST['senderName'];
    $senderEmail = $_REQUEST['senderEmail'];
    $receiverName = $_REQUEST['receiverName'];
    $emailSendTo = $_REQUEST['emailSendTo'];
    $message = $_REQUEST['message'];
    $page = $_REQUEST['page'];
    $lang = $_REQUEST['lang'];

    $page = ($lang === "ru") ? $page : 'en/' . $page;
    $link = $_SERVER['HTTP_HOST'].'/'.$page.'.html';



    if($lang === "ru") {
        $subject = "Рекомендация онлайн годового отчета TMK";
        $fullMessage = "
    Уважаемый пользователь,
    $senderName <$senderEmail> прислал Вам ссылку на годовой отчет компании MPCK Центра

    Дополнительно Вам поступило следующее сообщение:
    $message


    $link

    Обратите внимание, что адрес электронной почты отправителя не был проверен.

    С уважением,
    Отдел по работе с инвесторами компании ТМК";
    } else {
        $subject = "A recommendation for the online annual report of TMK";
        $fullMessage = "
    Dear Sir or Madam,

    This webpage link to the online annual report was sent by $senderName <$senderEmail>.

    His/her message for you is:

    $message


    $link

    Please note, the sender's e-mail address has not been verified.

    Best regards,

    TMK,
    Investor Relations";
    }

	if ( ($senderName=="") || ($senderEmail=="") || ($receiverName=="") || ($emailSendTo=="") )
		{
		echo "All fields are required, please fill <a href=\"\">the form</a> again.";
		}
	else{
		$from = "From: TMK<$senderEmail>\r\nReturn-path: $senderEmail";
		mail($emailSendTo, $subject, $fullMessage, $from);
		echo "Email sent!";
        header("Location: /");
		}
	}
