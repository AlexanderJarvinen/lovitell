<?php $customer->text = str_replace(array("\r\n", "\r", "\n"), "<br>", $customer->text); ?>
{!! $customer->text !!}
