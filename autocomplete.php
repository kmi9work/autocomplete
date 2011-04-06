<?php
header('Content-Type: text/html; charset=utf-8');
if($_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') {
  if($_GET['q']){
    sleep(1);
    if ($_GET['q'] == "$"){
      $base = @file("autocomplete.dat");
      for($i=0;$i<count($base);$i++){
        print $base[$i];
      }
    }else{
      $base = @file("autocomplete.dat");
      for($i=0;$i<count($base);$i++){
        $row_base = explode(":", $base[$i]);
        $res = mb_strpos(mb_strtolower($row_base[1],"UTF-8"), mb_strtolower($_GET['q'],"UTF-8"));
        if($res!==false&&$res==0) {
          $row_base[3] = trim($row_base[3]);
          print $row_base[1]."|".$row_base[3]."|".$row_base[2]."|".$row_base[0]."\n";
        }
      }
    }
  }else if($_GET['man']){
    sleep(1);
    print("<img src='ava.gif'><br>".$_GET['man'].": Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
  }else if($classifier = $_GET['classifier']){
    sleep(1);
    if ($_GET['type'] == "0"){
      if ($classifier == "cat1"){
        print "group1\nsub1\ncat1";
      }else if ($classifier == "group1"){
        print "group1\nsub1|sub2\ncat1|cat2|cat3|cat4|cat5";
      }else{
        print "group1|group2|group3\nsub1|sub2|sub3|sub4\ncat1|cat2|cat3|cat4|cat5|cat6|cat7";
      }
    }else if ($_GET['type'] == "1"){
      if ($classifier == "group1"){
        print "sub1\ncat1|cat2";
      }else if ($classifier == "group2"){
        print "sub2\ncat3|cat4|cat5";
      }else if ($classifier == "group3"){
        print "sub3|sub4\ncat6|cat7";
      }
      
    }else if ($_GET['type'] == "2"){
      if ($classifier == "sub1"){
        print "cat1|cat2";
      } else if ($classifier == "sub2"){
        print "cat3|cat4|cat5";
      } else if ($classifier == "sub3"){
        print "cat6";
      } else if ($classifier == "sub4"){
        print "cat7";
      }
    } 
  }
}
?>