use warnings;
use strict;

use lib 'lib';
use CodeTemplate;
use Util qw/write_file/;

die 'two arguments needed' if @ARGV < 2;

my $map = {
    model        => [\&touch_model_file],
    service      => [\&touch_service_file, \&touch_test_service_file],
    controller   => [\&touch_controller_file],
    test_model   => [\&touch_test_model_file],
    test_service => [\&touch_test_service_file],
};

my ($type, $name) = @ARGV[0, 1];

for my $func (@{ $map->{$type} }) {
    $func->($name);
}

sub touch_service_file {
    my ($name) = @_;
    my $dir = 'app/service';
    touch_file('service', $name, "$dir/$name.js", 2);
}

sub touch_controller_file {
    my ($name) = @_;
    my $dir = 'app/controller';
    touch_file('controller', $name, "$dir/$name.js", 4);
}

sub touch_model_file {
    my ($name) = @_;
    my $dir = 'app/model';
    touch_file('model', $name, "$dir/$name.js", 2);
}

sub touch_test_model_file {
    my ($name) = @_;
    my $dir = 'test/model';
    touch_file('test_model', $name, "$dir/test$name.js", 7);
}

sub touch_test_service_file {
    my ($name) = @_;
    my $dir = 'test/service';
    touch_file('test_service', $name, "$dir/test$name.js", 3);
}

sub touch_file {
    my ($type, $name, $path, $length) = @_;
    my $tmpl = CodeTemplate::TMPL->{$type};
    write_file(
        $path,
        sprintf $tmpl, map { $name } 1 .. $length
    );
}
