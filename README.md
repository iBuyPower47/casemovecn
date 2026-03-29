# CASEMOVE

*Casemove is an open-source desktop application that helps you easily move items out of and into Storage Units in Counter-Strike 2. The app utilizes the [Steam-user](https://github.com/DoctorMcKay/node-steam-user) & [Global Offensive](https://github.com/DoctorMcKay/node-globaloffensive) libraries to establish a connection with Steam and interact with the CS2 game coordinator.* 

> 计划对这个已废弃项目进行修复功能，依赖项升级，界面汉化与UI优化，提升兼容性、可维护性和使用体验。

----


## 中文维护分支说明

以下内容为 `casemovecn / CaseMoveCn` 分支的新增说明，用于补充原项目 README。原 README 主要描述上游 `Casemove 2.3.3`，而当前仓库已经基于本地维护需求进行了继续升级、修复与汉化。

### 当前分支状态

- 当前应用名称已调整为 `CaseMoveCn`
- 当前项目版本已提升到 `2.4.0`
- 发布版本检查已切换到当前仓库 `iBuyPower47/casemovecn`
- README 中原有英文说明和功能描述仍保留，中文部分以本分支实际改动为准

### 本分支已完成的更新

#### 1. 依赖与运行环境升级

- 将项目核心运行环境升级到较新的 Electron 技术栈，当前使用 `Electron 30.5.1`
- React 已升级到 `18.3.1`
- TypeScript 已升级到 `5.4.5`
- Tailwind CSS 已从原 README 中的 `v2` 升级到 `v3.4.19`
- React Router 已升级到 `v6`
- Redux 生态已更新到 `@reduxjs/toolkit 2.x`、`react-redux 9.x`、`redux 5.x`
- Jest / ts-jest / Testing Library 等开发依赖也已同步到较新的可维护版本
- `prepare` 脚本已调整为本地安装时跳过自动打包，降低依赖安装阶段失败的概率
- 新增 `prepare:package` 作为显式打包命令，便于区分“开发启动”和“正式构建”

#### 2. 汉化与本地化更新

- 已对主界面导航、登录页、设置页、库存页、存储单元页面、弹窗、通知等大量前端文案进行中文化处理
- 默认货币已调整为 `CNY`，更适合中文用户直接使用
- 项目保留并继续利用 `csgo_schinese` 相关物品翻译数据，同时保留英文翻译回退逻辑
- 当前仓库的目标是持续推进中文可用性，后续应以 UTF-8 编码统一维护文案，避免个别历史文件出现乱码遗留问题

#### 3. UI 与前端结构重构

- 旧的 `index.html` / `index.css` 结构已替换为新的 `index.ejs` + 样式入口方案
- 新增 `src/renderer/styles/design-tokens.css`，将主题色、背景层级、边框、文字颜色等抽离为统一设计变量
- 新增 `src/renderer/components/ui` 目录，补充基础 UI 组件与视觉特效组件，便于后续复用与继续优化
- 主界面、库存表格、筛选面板、存入/取出页面、登录与设置页面均已做较大规模视觉重构
- 新增渲染层错误边界 `AppErrorBoundary`，用于在前端崩溃时提供兜底错误展示，提升可维护性
- Redux 持久化与应用挂载流程已重新整理，提升状态恢复与渲染初始化的稳定性

#### 4. 功能与项目结构调整

- 项目主功能仍然围绕 CS2 库存查看、存储单元物品转移、价格展示、筛选与批量操作展开
- 自动更新、版本检查、应用标识、包名等已改为当前中文维护分支对应配置
- 独立 `Trade Up` 页面相关旧目录已从当前导航结构中移除或重整，README 原有这部分功能描述主要代表上游历史设计，不完全等同于本分支当前界面结构
- 当前导航与页面组织更聚焦于 `总览 / 取出 / 存入 / 库存 / 设置` 这些核心功能

### 当前建议的开发与构建方式

#### 本地开发

```bash
npm install
npm run start
```

如果安装阶段仍遇到原项目依赖链问题，可优先确认：

- Node.js 版本是否与 Electron 生态兼容
- 原生依赖是否已正确重建
- Steam / Global Offensive 相关依赖是否已正常拉取

#### 本地打包

```bash
npm run prepare:package
```

Windows 签名相关说明仍可参考下方原 README 的 `dev comments`。如果只是本地开发调试，通常不需要先完成签名流程。

### 说明

本 README 当前采用“保留原文 + 追加中文维护说明”的方式维护，便于同时对照上游项目描述与当前中文分支的实际状态。如果后续继续升级依赖、修正文案乱码、补充中文截图或发布新的安装包，建议在本节继续追加版本记录。

## dev comments

installation is a bit buggy for me but npm install fails but somehov npm run start and npm run prepare work

install signtool
https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/

create .env file with 
```
SIGNING_TIMESTAMP=http://timestamp.acs.microsoft.com
SIGNING_PATH=path\to\casemove\
```
and then create self signed cert and move it to casemove path
```
$cert = New-SelfSignedCertificate -DNSName "www.domain.com" -CertStoreLocation Cert:\CurrentUser\My -Type CodeSigningCert -Subject “Example Code Signing Certificate”

$CertPassword = ConvertTo-SecureString -String "my_password" -Force -AsPlainText

$certfile = Get-ChildItem -Path Cert:\CurrentUser\My\$($cert.Thumbprint)

Export-PfxCertificate -Cert $certfile -FilePath "C:\Cert$certificate.pfx" -Password $CertPassword

#or 

Export-Certificate -Cert $certfile -FilePath "C:\Cert$certificate.cert" -Type CERT
```

## Download Latest Version (Casemove 2.3.3)

This is the latest stable version and can be downloaded from the [releases](https://github.com/nombersDev/casemove/releases) page, or directly from:


- [Windows - (Casemove-2.3.3)](https://github.com/nombersDev/casemove/releases/download/v2.3.3/Casemove-Setup-2.3.3.exe)
- [Mac - (Casemove-2.3.3)](https://github.com/nombersDev/casemove/releases/download/v2.3.3/Casemove-2.3.3.dmg)
- [Mac ARM 64 (M1) - (Casemove-2.3.3)](https://github.com/nombersDev/casemove/releases/download/v2.3.3/Casemove-2.3.3-arm64.dmg)
- [Linux Deb - (Casemove-2.3.3)](https://github.com/nombersDev/casemove/releases/download/v2.3.3/casemove_2.3.3_amd64.deb)

## Support

Please join the Casemove discord for support: https://discord.gg/4dSBdt4uJ3

https://user-images.githubusercontent.com/98760010/181345579-e4fd11be-1af9-4b8b-a211-5747fdd414aa.mp4




Features include:
  * An overview page of your storage contents
  * Log in without entering your password / Steam Guard
  * View your inventory
  * View your storage units contents
  * View the Value of your inventory and storage units
  * Move items out of and into your storage units in bulk instead of clicking on the individual items
  * Rename your storage units
  * Sort, search and filter your inventory
  * Sort, search and filter your storage units contents
  * Download a file over your Storage units and inventory contents
  * Switch between multiple accounts easily
  * Use your shared secret key instead of an auth code to log in 
  * See your storage unit's and inventory value from Buff, Skinport & SCM in almost all currencies

Trade up features:
  * Complete trade up contracts from within the app! 
  * See the possible outcomes from your trade up contract
  * See an estimated EV of your trade up contract recipe


 
 
----

### How To Use

Use this link to install [Casemove](https://github.com/nombersDev/casemove/releases) 

To use:
  * Download the latest stable version of Casemove
  * Install the application
  * Run the app
  * Log in

----

## COMMON QUESTIONS
#### Can I be VAC banned?

No.
The app doesn’t interact with your CS2 game client. It doesn’t inject any code into the game. You don’t even need to have the game installed for the app to run. All the app does is connect to Steam and emulate a CS2 connection.

Furthermore, the libraries [Steam-user](https://github.com/DoctorMcKay/node-steam-user) & [Global Offensive](https://github.com/DoctorMcKay/node-globaloffensive) have been used by thousands of people, and this app is merely a cosmetic rendition of these libraries.

#### Does Casemove store any of my information?

No, Casemove doesn’t store any information on your computer, except for when you ask it to remember your refresh token. As of Casemove 2.3.3, Casemove no longer stores your password when you login. The refresh token is stored safely using [safeStore](https://www.electronjs.org/docs/latest/api/safe-storage). Casemove doesn’t send any information to anyone outside of Steam.

#### Why can't I just log in using the Steam Web authentication?

In order to move items in and out of Storage Units, the app needs to have an active connection with the CS2 game coordinator. This is not possible when using the web authentication method. However, take a look at the question below. 

#### How does the browser login work?

The browser login feature works by you logging in to the regular Steam website which makes Steam generate a one time string that you, amongst other things, can use to log in to casemove. This is the safest login method, as the generated string is single use which means that even if someone got a hold of it, it would be useless to them. To get the string open this [URL](https://steamcommunity.com/chat/clientjstoken).

#### Where can I read more about the safety?

Casemove is comparable to the software "Archi Steam Farm" and since Archi has made a terrific wiki on this issue, I'd refer over this wiki for further [reading](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/FAQ#security--privacy--vac--bans--tos)

As with anything, It's important to know that the using this software is distributed "as is" and without any warranty. 

----
## Built using
- Node version 14.18.2
- React Electron Boilerplate
- Tailwind v2
----

## Author

Casemove was created by Nombers.

- Steam: https://steamcommunity.com/id/realNombers/
- Reddit: https://www.reddit.com/user/nubbiners
- Discord: Nombers#1046
----

## How to build

The main instructions on how to build the application from source be found using the [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) and it's [docs](https://electron-react-boilerplate.js.org/docs/building). 
I've built the app using [NVM](https://github.com/nvm-sh/nvm) with node version 14.18.2. 


----

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License  along with this program.  If not, see http://www.gnu.org/licenses/.


<!--- Frycus will never know this is here ---> 
