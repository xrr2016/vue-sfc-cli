#!/bin/sh
html_url=`curl https://api.github.com/repos/FEMessage/vue-sfc-cli/releases/latest | sed -n 5p | sed 's/\"html_url\"://g' | awk -F '"' '{print $2}'`
body=`curl https://api.github.com/repos/FEMessage/vue-sfc-cli/releases/latest | grep body | sed 's/\"body\"://g;s/\"//g'`

msg='{"msgtype": "markdown", "markdown": {"title": "新版本发布", "text": "@所有人\n# ['$html_url']('$html_url')\n'$body'"}}'

#echo $msg

curl -X POST https://oapi.dingtalk.com/robot/send\?access_token\=$DINGTALK_ROBOT_TOKEN -H 'Content-Type: application/json' -d "$msg"

