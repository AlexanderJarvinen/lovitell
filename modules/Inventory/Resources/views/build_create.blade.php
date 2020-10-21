@extends('layouts.adminlte')

@section('content')
    <div class="row">
        <div class="col-md-12">
            <table align="left" cellpadding="4" cellspacing="1" border="0" bgcolor="#d7d7d7">
                <tr bgcolor="#FFFFFF">
                    <td colspan="3">
                        <div align="center"><font color="#0000FF" size="+2" face="Arial">Новый дом</font></div>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <form action="new_home.php" method="post" name="form_new_home" onsubmit="return FormValid()">
                        <td>
                            <b>Регион</b>
                        </td>
                        <td>
                            <select name="region" onchange="document.forms['form_new_home'].submit()">
                                <option value="12">Долгопрудный</option><br>                     <option value="21">ЗАО Крылатское</option><br>                     <option value="27">ЗАО Кунцево</option><br>                     <option value="14">Красная горка</option><br>                     <option value="25">Красногорск</option><br>                     <option value="17">Мытищи 16 м-н</option><br>                     <option value="2">НАО Бунинский</option><br>                     <option value="13">Не определен</option><br>                     <option value="24">Одинцово</option><br>                     <option value="18">Пресненский</option><br>                     <option value="7">САО Аэропорт</option><br>                     <option value="11">СВАО Южное Медведково</option><br>                     <option value="1024">СЗАО Митино</option><br>                     <option value="256">СЗАО Покровское-Стрешнево</option><br>                     <option value="16">СЗАО Строгино</option><br>                     <option value="4">СЗАО Тушино Северное</option><br>                     <option value="8">СЗАО Тушино Южное</option><br>                     <option value="128">СЗАО Хорошево-Мневники</option><br>                     <option value="1">СЗАО Щукино</option><br>                     <option value="23">Тестовый</option><br>                     <option value="3">Химки-Левобережный</option><br>                     <option value="15">Химки-Новокуркино</option><br>                     <option value="26">Химки-Юбилейный</option><br>                     <option value="10">ЮАО Донской</option><br>                     <option value="9">ЮАО Чертаново Южное</option><br>                     <option value="20">ЮЗАО Забликово</option><br>                     <option value="22">ЮЗАО Теплый стан</option><br>                     <option value="19">ЮЗАО Черемушки</option><br>                     <option value="2048">Юрлово</option><br><script language="JavaScript">document.all.region.value="1";</script>            </select>
                            <input type="button" value="..." size="2" onclick="SearchRegion()">
                            <script language="JavaScript">
                                function SetRegValueregId( id )
                                {
                                    document.forms['form_new_home'].region.value = id;
                                    document.forms['form_new_home'].submit();
                                }
                                function SearchRegion()
                                {
                                    ShowSearchRegions( 1 );
                                }
                            </script>

                        </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <b>Улица:</b>
                    </td>
                    <td>
                        <select name="street">
                            <option value='118'>12 марта</option><option value='2202'>2-ой Грайвороновский проезд</option><option value='145'>Авиационная</option><option value='154'>Академика Бочвара</option><option value='155'>Академика Курчатова</option><option value='2125'>Алабяна,</option><option value='41'>Берзарина</option><option value='38'>Волоколамский 1-й</option><option value='39'>Волоколамский 3-й</option><option value='40'>Волоколамский Б.</option><option value='2234'>Врачебный проезд</option><option value='379'>Гамалеи</option><option value='1998'>Дыбенко</option><option value='46'>Живописная</option><option value='562'>Ирины Левченко</option><option value='45'>М.Вершинина</option><option value='809'>М.Новикова</option><option value='817'>Максимова</option><option value='42'>Маршала Бирюзова</option><option value='44'>Маршала Василевского</option><option value='47'>Маршала Конева</option><option value='49'>Маршала Малиновского</option><option value='51'>Маршала Мерецкова</option><option value='57'>Маршала Рыбалко</option><option value='810'>Маршала Соколовского</option><option value='52'>Народного Ополчения</option><option value='53'>Новощукинская</option><option value='54'>Пехотная</option><option value='115'>Пехотный 1-й</option><option value='1175'>Площадь ак.Курчатова</option><option value='55'>Расплетина</option><option value='56'>Рогова</option><option value='59'>Тепличный</option><option value='60'>Щукинская</option><option value='2019'>Южная</option><script language="JavaScript">document.all.street.value="118";</script>         </select>
                        <button class="button" onclick="insert_newstreet()">Новая</button>
                        <div id="newstreet">
                        </div>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td>
                        <b>Дом:</b>
                    </td>
                    <td>
                        <input type="text" size="1" name="house">
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td valign="top"><b>Корпус:</b></td>
                    <td><input type="text" name="body" size="1"><br></td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td valign="top"><b>Тип:</b></td>
                    <td><select name="home_type" size="1">
                            <option value='0'>ЖД</option><option value='1'>БЦ</option><option value='2'>ТЦ</option><option value='3'>ПЗ</option>      </select></td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td valign="top"><b>Кол-во подъездов:</b></td>
                    <td><input type="text" name="floors" size="1"><br></td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td valign="top"><b>Кол-во этажей:</b></td>
                    <td><input type="text" name="entrances" size="1"><br></td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td valign="top"><b>Потенциальных:</b></td>
                    <td><input type="text" name="potential" size="1"><br></td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td valign="top"><b>Координаты:</b></td>
                    <td>
                        <b>X:</b><input type="text" name="X" size="2" readonly>&nbsp;
                        <b>Y:</b><input type="text" name="Y" size="2" readonly>
                        <input type="button" size="2" value="..." onclick="OpenMapByRegionWin(1,0)">
                        <br>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td valign="top" colspan="2">
                        <textarea name="note" rows="7" style="width: 100%;" title="Note"></textarea>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td valign="top" colspan="2">
                        <textarea name="memo" rows="7" style="width: 100%;" title="Memo"></textarea>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td valign="top"><b>Цена:</b></td>
                    <td><input type="text" name="price" size="10" maxlength="10" value="0"><br></td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td></td>
                    <td align="right">
                        <input type="hidden" name="newstr" value="0">
                        <input type="submit" value="Отправить" class="button">&nbsp;&nbsp;
                        <button class="button" onclick="window.close()">Закрыть</button>
                    </td>
                </tr>
                <tr bgcolor="#FFFFFF">
                    <td valign="top"></td>
                    <td>
                        <input type="checkbox" name="show_new"  >&nbsp;Отобразить новый дом
                    </td>
                </tr>
                </form>
                </tr>
            </table>
        </div>
    </div>
@else
    <h1>Дом с таким идентификатором адреса не найден</h1>
@endif
@endsection
